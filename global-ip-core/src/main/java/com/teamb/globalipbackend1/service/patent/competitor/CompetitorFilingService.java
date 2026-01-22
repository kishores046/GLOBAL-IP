package com.teamb.globalipbackend1.service.patent.competitor;

import com.teamb.globalipbackend1.dto.competitor.*;
import com.teamb.globalipbackend1.dto.websocket.CompetitorFilingEvent;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoCompetitorFilingDto;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewClient;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewAssignee;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponseDocument;
import com.teamb.globalipbackend1.external.patentsview.mapper.PatentsViewMapStructMapper;
import com.teamb.globalipbackend1.model.patents.*;
import com.teamb.globalipbackend1.model.subscription.*;
import com.teamb.globalipbackend1.repository.competitor.*;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import com.teamb.globalipbackend1.service.websocket.WebSocketNotificationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompetitorFilingService {

    private final PatentsViewClient patentsViewClient;
    private final CompetitorFilingRepository filingRepository;
    private final CompetitorRepository competitorRepository;
    private final PatentsViewMapStructMapper mapper;
    private final EpoClient epoClient;

    private final MonitoringSubscriptionRepository subscriptionRepository;
    private final WebSocketNotificationService wsService;

    /* ===================== SYNC ===================== */

    @Transactional
    public SyncResultDTO fetchLatestFilings(LocalDate fromDate) {

        LocalDateTime started = LocalDateTime.now();
        List<Competitor> competitors = competitorRepository.findByActiveTrue();

        if (competitors.isEmpty()) {
            return buildEmptySyncResult(started);
        }

        int newTotal = 0;
        int dupTotal = 0;
        List<CompetitorSyncResult> details = new ArrayList<>();

        for (Competitor c : competitors) {

            CompetitorSyncResult r;

            switch (c.getJurisdiction().toUpperCase()) {
                case "US" -> r = syncUsCompetitorFilings(c, fromDate);
                case "EP" -> r = syncEpoCompetitor(c, fromDate);
                case "BOTH" -> {
                    CompetitorSyncResult us = syncUsCompetitorFilings(c, fromDate);
                    CompetitorSyncResult ep = syncEpoCompetitor(c, fromDate);
                    details.addAll(List.of(us, ep));
                    newTotal += us.getNewFilings() + ep.getNewFilings();
                    dupTotal += us.getDuplicates() + ep.getDuplicates();
                    continue;
                }
                default -> {
                    continue;
                }
            }

            details.add(r);
            newTotal += r.getNewFilings();
            dupTotal += r.getDuplicates();

            if (r.getNewFilings() > 0) {
                notifySubscribers(c, r.getNewFilings());
            }
        }

        return SyncResultDTO.builder()
                .syncStarted(started)
                .syncCompleted(LocalDateTime.now())
                .competitorsProcessed(competitors.size())
                .newFilingsFound(newTotal)
                .duplicatesSkipped(dupTotal)
                .details(details)
                .build();
    }

    /* ===================== QUERY APIs ===================== */

    @Transactional(readOnly = true)
    public List<CompetitorFilingDTO> getFilingsForCompetitor(Long competitorId) {
        Competitor c = competitorRepository.findById(competitorId)
                .orElseThrow();
        return filingRepository
                .findByCompetitorIdOrderByPublicationDateDesc(competitorId)
                .stream()
                .map(f -> toDTO(f, c))
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<@NonNull CompetitorFilingDTO> getFilingsForCompetitorPaginated(
            Long competitorId, int page, int size
    ) {
        Competitor c = competitorRepository.findById(competitorId).orElseThrow();
        Pageable pageable = PageRequest.of(page, size);
        return filingRepository
                .findByCompetitorIdOrderByPublicationDateDesc(competitorId, pageable)
                .map(f -> toDTO(f, c));
    }

    @Transactional(readOnly = true)
    public Page<@NonNull CompetitorFilingDTO> searchFilings(FilingSearchRequest req) {
        Pageable p = PageRequest.of(
                Optional.ofNullable(req.getPage()).orElse(0),
                Optional.ofNullable(req.getSize()).orElse(50)
        );

        Page<CompetitorFiling> filings = filingRepository.searchFilings(
                req.getCompetitorIds(),
                req.getFromDate(),
                req.getToDate(),
                req.getJurisdiction(),
                p
        );

        Map<Long, Competitor> map =
                competitorRepository.findAllById(
                        filings.stream()
                                .map(CompetitorFiling::getCompetitorId)
                                .distinct()
                                .toList()
                ).stream().collect(Collectors.toMap(Competitor::getId, c -> c));

        return filings.map(f -> toDTO(f, map.get(f.getCompetitorId())));
    }

    @Transactional(readOnly = true)
    public List<FilingTrendDTO> getFilingTrends(LocalDate fromDate) {
        return filingRepository.countByCompetitorSince(fromDate).stream()
                .map(r -> FilingTrendDTO.builder()
                        .competitorCode("C" + r[0])
                        .count((Long) r[1])
                        .periodStart(fromDate)
                        .periodEnd(LocalDate.now())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Map<String, Long>> getMonthlyFilingTrends(LocalDate fromDate) {
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        for (Object[] r : filingRepository.countByCompetitorAndMonth(fromDate)) {
            result.computeIfAbsent(
                    String.valueOf(r[0]), k -> new LinkedHashMap<>()
            ).put(
                    YearMonth.of((Integer) r[1], (Integer) r[2]).toString(),
                    (Long) r[3]
            );
        }
        return result;
    }

    @Transactional(readOnly = true)
    public FilingSummaryDTO getFilingSummary() {

        Object[] row = filingRepository.getFilingSummaryStats();

        return FilingSummaryDTO.builder()
                .totalFilings(((Number) row[0]).longValue())
                .oldestFiling((LocalDate) row[1])
                .newestFiling((LocalDate) row[2])
                .competitorsTracked(((Number) row[3]).longValue())
                .byCompetitor(filingRepository.getFilingSummaryByCompetitor())
                .build();
    }


    /* ===================== INTERNAL ===================== */

    private void notifySubscribers(Competitor c, int newFilings) {

        subscriptionRepository
                .findByTypeAndStatus(
                        MonitoringType.COMPETITOR_FILING,
                        SubscriptionStatus.ACTIVE
                )
                .stream()
                .filter(s -> s.getTier() != SubscriptionTier.BASIC)
                .forEach(s ->
                        wsService.sendCompetitorFilingUpdate(
                                s.getUserId(),
                                new CompetitorFilingEvent(
                                        c.getId(),
                                        c.getCode(),
                                        newFilings,
                                        null,
                                        LocalDateTime.now()
                                )
                        )
                );
    }

    private CompetitorSyncResult syncUsCompetitorFilings(
            Competitor c, LocalDate from
    ) {
        int n = 0, d = 0;
        for (PatentsViewResponseDocument doc :
                patentsViewClient.searchByAssignees(c.getAssigneeNames(), from)) {

            if (filingRepository.existsByPatentId(doc.getPatentId())) {
                d++; continue;
            }

            filingRepository.save(buildFilingFromPatent(c, doc));
            n++;
        }
        return CompetitorSyncResult.builder()
                .competitorCode(c.getCode())
                .newFilings(n)
                .duplicates(d)
                .status("SUCCESS")
                .build();
    }

    private CompetitorSyncResult syncEpoCompetitor(
            Competitor c, LocalDate from
    ) {
        int n = 0, d = 0;
        for (EpoCompetitorFilingDto dto :
                epoClient.fetchCompetitorFilings(c.getAssigneeNames(), from)) {

            if (filingRepository.existsByPatentId(dto.getPublicationNumber())) {
                d++; continue;
            }

            filingRepository.save(
                    CompetitorFiling.builder()
                            .competitorId(c.getId())
                            .patentId(dto.getPublicationNumber())
                            .title(
                                    Optional.ofNullable(dto.getTitle())
                                            .orElse("Untitled Patent")
                            )
                            .publicationDate(dto.getPublicationDate()) // may be null → OK
                            .jurisdiction("EP")
                            .filedBy(c.getDisplayName())
                            .currentOwner(
                                    Optional.ofNullable(dto.getApplicant()).orElse("N/A")
                            )
                            .filingType(dto.getKind())
                            .status("PUBLISHED")
                            .fetchedAt(LocalDateTime.now())
                            .build()
            );

            n++;
        }
        return CompetitorSyncResult.builder()
                .competitorCode(c.getCode())
                .newFilings(n)
                .duplicates(d)
                .status("SUCCESS")
                .build();
    }

    private CompetitorFiling buildFilingFromPatent(
            Competitor c, PatentsViewResponseDocument d
    ) {
        LocalDate publicationDate =
                d.getPatentDate() != null
                        ? d.getPatentDate()
                        : null; // explicitly allow null

        return CompetitorFiling.builder()
                .competitorId(c.getId())
                .patentId(d.getPatentId())
                .title(
                        Optional.ofNullable(d.getPatentTitle())
                                .orElse("Untitled Patent")
                )
                .publicationDate(publicationDate)
                .jurisdiction("US")
                .filedBy(c.getDisplayName())
                .currentOwner(extractCurrentOwner(d))
                .filingType(d.getWipoKind())
                .status("ACTIVE")
                .fetchedAt(LocalDateTime.now())
                .build();
    }

    private String extractCurrentOwner(PatentsViewResponseDocument d) {
        return Optional.ofNullable(d.getPatentsViewAssignees())
                .orElse(List.of())
                .stream()
                .map(PatentsViewAssignee::getAssigneeOrganisation)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("N/A");
    }

    private CompetitorFilingDTO toDTO(CompetitorFiling f, Competitor c) {
        return CompetitorFilingDTO.builder()
                .id(f.getId())
                .competitorId(f.getCompetitorId())
                .competitorCode(c.getCode())
                .competitorName(c.getDisplayName())
                .patentId(f.getPatentId())
                .title(f.getTitle())
                .publicationDate(f.getPublicationDate())
                .jurisdiction(f.getJurisdiction())
                .status(f.getStatus())
                .fetchedAt(f.getFetchedAt())
                .build();
    }

    private SyncResultDTO buildEmptySyncResult(LocalDateTime t) {
        return SyncResultDTO.builder()
                .syncStarted(t)
                .syncCompleted(LocalDateTime.now())
                .competitorsProcessed(0)
                .newFilingsFound(0)
                .duplicatesSkipped(0)
                .details(List.of())
                .build();
    }
}
