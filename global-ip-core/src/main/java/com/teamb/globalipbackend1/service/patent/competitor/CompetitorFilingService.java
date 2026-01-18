package com.teamb.globalipbackend1.service.patent.competitor;


import com.teamb.globalipbackend1.dto.competitor.*;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoCompetitorFilingDto;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewClient;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewAssignee;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponseDocument;
import com.teamb.globalipbackend1.external.patentsview.mapper.PatentsViewMapStructMapper;
import com.teamb.globalipbackend1.model.patents.Competitor;
import com.teamb.globalipbackend1.model.patents.CompetitorFiling;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.repository.competitor.CompetitorFilingRepository;
import com.teamb.globalipbackend1.repository.competitor.CompetitorRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
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


    /**
     * Fetch latest filings for all active competitors
     */
    @Transactional
    public SyncResultDTO fetchLatestFilings(LocalDate fromDate) {

        LocalDateTime syncStarted = LocalDateTime.now();
        List<Competitor> activeCompetitors = competitorRepository.findByActiveTrue();

        if (activeCompetitors.isEmpty()) {
            return buildEmptySyncResult(syncStarted);
        }

        int totalNewFilings = 0;
        int totalDuplicates = 0;
        List<CompetitorSyncResult> details = new ArrayList<>();

        for (Competitor competitor : activeCompetitors) {

            String jurisdiction = competitor.getJurisdiction();

            if ("US".equalsIgnoreCase(jurisdiction)) {
                CompetitorSyncResult r =
                        syncUsCompetitorFilings(competitor, fromDate);
                details.add(r);
                totalNewFilings += r.getNewFilings();
                totalDuplicates += r.getDuplicates();

            } else if ("EP".equalsIgnoreCase(jurisdiction)) {
                CompetitorSyncResult r =
                        syncEpoCompetitor(competitor, fromDate);
                details.add(r);
                totalNewFilings += r.getNewFilings();
                totalDuplicates += r.getDuplicates();

            } else if ("BOTH".equalsIgnoreCase(jurisdiction)) {
                CompetitorSyncResult us =
                        syncUsCompetitorFilings(competitor, fromDate);
                CompetitorSyncResult ep =
                        syncEpoCompetitor(competitor, fromDate);

                details.add(us);
                details.add(ep);

                totalNewFilings += us.getNewFilings() + ep.getNewFilings();
                totalDuplicates += us.getDuplicates() + ep.getDuplicates();
            }
        }

        return SyncResultDTO.builder()
                .syncStarted(syncStarted)
                .syncCompleted(LocalDateTime.now())
                .competitorsProcessed(activeCompetitors.size())
                .newFilingsFound(totalNewFilings)
                .duplicatesSkipped(totalDuplicates)
                .details(details)
                .build();
    }


    /**
     * Sync filings for a specific competitor
     */
    @Transactional
    public CompetitorSyncResult syncUsCompetitorFilings(Competitor competitor, LocalDate fromDate) {

        log.info("Syncing filings for competitor: {}", competitor.getCode());

        try {
            // Fetch patents from PatentsView API
            List<PatentsViewResponseDocument> apiDocuments = patentsViewClient.searchByAssignees(
                    competitor.getAssigneeNames(),
                    fromDate
            );

            int newFilings = 0;
            int duplicates = 0;

            for (PatentsViewResponseDocument apiDoc : apiDocuments) {

                String patentId = apiDoc.getPatentId();

                // Skip if already exists
                if (filingRepository.existsByPatentId(patentId)) {
                    duplicates++;
                    continue;
                }

                // Convert to PatentDocument using existing mapper
                PatentDocument patentDoc = mapper.toPatentDocument(apiDoc);

                // Build CompetitorFiling entity
                CompetitorFiling filing = buildFilingFromPatent(competitor, patentDoc, apiDoc);
                filingRepository.save(filing);
                newFilings++;
            }

            log.info("Competitor {}: {} new filings, {} duplicates",
                    competitor.getCode(), newFilings, duplicates);

            return CompetitorSyncResult.builder()
                    .competitorCode(competitor.getCode())
                    .newFilings(newFilings)
                    .duplicates(duplicates)
                    .status("SUCCESS")
                    .build();

        } catch (Exception e) {
            log.error("Failed to sync filings for competitor: {}", competitor.getCode(), e);

            return CompetitorSyncResult.builder()
                    .competitorCode(competitor.getCode())
                    .newFilings(0)
                    .duplicates(0)
                    .status("FAILED")
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    /**
     * Get filings for a specific competitor
     */
    @Transactional(readOnly = true)
    public List<CompetitorFilingDTO> getFilingsForCompetitor(Long competitorId) {

        Competitor competitor = competitorRepository.findById(competitorId)
                .orElseThrow(() -> new IllegalArgumentException("Competitor not found: " + competitorId));

        List<CompetitorFiling> filings =
                filingRepository.findByCompetitorIdOrderByPublicationDateDesc(competitorId);

        return filings.stream()
                .map(f -> toDTO(f, competitor))
                .collect(Collectors.toList());
    }

    /**
     * Get paginated filings for a competitor
     */
    @Transactional(readOnly = true)
    public Page<@NonNull CompetitorFilingDTO> getFilingsForCompetitorPaginated(
            Long competitorId,
            int page,
            int size) {

        Competitor competitor = competitorRepository.findById(competitorId)
                .orElseThrow(() -> new IllegalArgumentException("Competitor not found: " + competitorId));

        Pageable pageable = PageRequest.of(page, size);
        Page<@NonNull CompetitorFiling> filings =
                filingRepository.findByCompetitorIdOrderByPublicationDateDesc(competitorId, pageable);

        return filings.map(f -> toDTO(f, competitor));
    }

    /**
     * Search filings with filters
     */
    @Transactional(readOnly = true)
    public Page<@NonNull CompetitorFilingDTO> searchFilings(FilingSearchRequest request) {

        Pageable pageable = PageRequest.of(
                request.getPage() != null ? request.getPage() : 0,
                request.getSize() != null ? request.getSize() : 50
        );

        Page<@NonNull CompetitorFiling> filings = filingRepository.searchFilings(
                request.getCompetitorIds(),
                request.getFromDate(),
                request.getToDate(),
                request.getJurisdiction(),
                pageable
        );

        // Load competitors for DTOs
        Map<Long, Competitor> competitorMap = loadCompetitorMap(
                filings.getContent().stream()
                        .map(CompetitorFiling::getCompetitorId)
                        .distinct()
                        .collect(Collectors.toList())
        );

        return filings.map(f -> toDTO(f, competitorMap.get(f.getCompetitorId())));
    }

    /**
     * Get filing trends by competitor
     */
    @Transactional(readOnly = true)
    public List<FilingTrendDTO> getFilingTrends(LocalDate fromDate) {

        List<Object[]> results = filingRepository.countByCompetitorSince(fromDate);
        Map<Long, Competitor> competitorMap = loadCompetitorMap(
                results.stream()
                        .map(r -> (Long) r[0])
                        .collect(Collectors.toList())
        );

        return results.stream()
                .map(r -> {
                    Long competitorId = (Long) r[0];
                    Long count = (Long) r[1];
                    Competitor competitor = competitorMap.get(competitorId);

                    return FilingTrendDTO.builder()
                            .competitorCode(competitor != null ? competitor.getCode() : "UNKNOWN")
                            .competitorName(competitor != null ? competitor.getDisplayName() : "Unknown")
                            .count(count)
                            .periodStart(fromDate)
                            .periodEnd(LocalDate.now())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get monthly filing trends
     */
    @Transactional(readOnly = true)
    public Map<String, Map<String, Long>> getMonthlyFilingTrends(LocalDate fromDate) {

        List<Object[]> results = filingRepository.countByCompetitorAndMonth(fromDate);
        Map<Long, Competitor> competitorMap = loadCompetitorMap(
                results.stream()
                        .map(r -> (Long) r[0])
                        .distinct()
                        .collect(Collectors.toList())
        );

        Map<String, Map<String, Long>> trends = new LinkedHashMap<>();

        for (Object[] row : results) {
            Long competitorId = (Long) row[0];
            Integer year = (Integer) row[1];
            Integer month = (Integer) row[2];
            Long count = (Long) row[3];

            Competitor competitor = competitorMap.get(competitorId);
            String competitorCode = competitor != null ? competitor.getCode() : "UNKNOWN";
            String monthKey = YearMonth.of(year, month).toString();

            trends.computeIfAbsent(competitorCode, k -> new LinkedHashMap<>())
                    .put(monthKey, count);
        }

        return trends;
    }

    /**
     * Get filing summary statistics
     */
    @Transactional(readOnly = true)
    public FilingSummaryDTO getFilingSummary() {

        Object raw = filingRepository.getFilingSummaryStats();

        Object[] stats;

        // 🔒 Defensive unwrapping (THIS fixes your crash)
        if (raw instanceof Object[]) {
            stats = (Object[]) raw;
        } else {
            throw new IllegalStateException("Unexpected summary result type: " + raw.getClass());
        }

        long totalFilings = 0L;
        LocalDate oldestFiling = null;
        LocalDate latestFiling = null;

        if (stats.length >= 3) {
            if (stats[0] instanceof Number n) {
                totalFilings = n.longValue();
            }
            if (stats[1] instanceof LocalDate d1) {
                oldestFiling = d1;
            }
            if (stats[2] instanceof LocalDate d2) {
                latestFiling = d2;
            }
        }

        long competitorsTracked =
                filingRepository.findAll().stream()
                        .map(CompetitorFiling::getCompetitorId)
                        .distinct()
                        .count();

        log.info(
                "Summary → total={}, competitors={}, oldest={}, latest={}",
                totalFilings, competitorsTracked, oldestFiling, latestFiling
        );

        return FilingSummaryDTO.builder()
                .totalFilings(totalFilings)
                .competitorsTracked(competitorsTracked)
                .oldestFiling(oldestFiling)
                .newestFiling(latestFiling)
                .build();
    }



    // ========== Helper Methods ==========

    /**
     * Build CompetitorFiling entity from patent data
     */
    private CompetitorFiling buildFilingFromPatent(
            Competitor competitor,
            PatentDocument patentDoc,
            PatentsViewResponseDocument apiDoc
    ) {
        return CompetitorFiling.builder()
                .competitorId(competitor.getId())
                .patentId(apiDoc.getPatentId())
                .title(apiDoc.getPatentTitle())
                .publicationDate(apiDoc.getPatentDate())
                .jurisdiction("US")
                .filedBy(competitor.getDisplayName())
                .currentOwner(extractCurrentOwner(apiDoc))
                .filingType(apiDoc.getWipoKind())
                .status("ACTIVE")
                .fetchedAt(LocalDateTime.now())
                .build();
    }



    /**
     * Convert entity to DTO
     */
    private CompetitorFilingDTO toDTO(CompetitorFiling filing, Competitor competitor) {
        return CompetitorFilingDTO.builder()
                .id(filing.getId())
                .competitorId(filing.getCompetitorId())
                .competitorCode(competitor != null ? competitor.getCode() : null)
                .competitorName(competitor != null ? competitor.getDisplayName() : null)
                .patentId(filing.getPatentId())
                .title(filing.getTitle())
                .publicationDate(filing.getPublicationDate())
                .jurisdiction(filing.getJurisdiction())
                .filedBy(filing.getFiledBy())
                .currentOwner(filing.getCurrentOwner())
                .filingType(filing.getFilingType())
                .status(filing.getStatus())
                .fetchedAt(filing.getFetchedAt())
                .build();
    }


    /**
     * Load competitor map for efficient lookup
     */
    private Map<Long, Competitor> loadCompetitorMap(List<Long> competitorIds) {
        return competitorRepository.findAllById(competitorIds).stream()
                .collect(Collectors.toMap(Competitor::getId, c -> c));
    }

    /**
     * Build empty sync result
     */
    private SyncResultDTO buildEmptySyncResult(LocalDateTime syncStarted) {
        return SyncResultDTO.builder()
                .syncStarted(syncStarted)
                .syncCompleted(LocalDateTime.now())
                .competitorsProcessed(0)
                .newFilingsFound(0)
                .duplicatesSkipped(0)
                .details(Collections.emptyList())
                .build();
    }

    private CompetitorSyncResult syncEpoCompetitor(
            Competitor competitor,
            LocalDate fromDate
    ) {
        List<EpoCompetitorFilingDto> epoFilings =
                epoClient.fetchCompetitorFilings(
                        competitor.getAssigneeNames(),
                        fromDate
                );

        int newFilings = 0;
        int duplicates = 0;

        for (EpoCompetitorFilingDto dto : epoFilings) {
            if (filingRepository.existsByPatentId(dto.getPublicationNumber())) {
                duplicates++;
                continue;
            }

            CompetitorFiling filing = CompetitorFiling.builder()
                    .competitorId(competitor.getId())
                    .patentId(dto.getPublicationNumber())
                    .title(dto.getTitle())
                    .publicationDate(dto.getPublicationDate())
                    .jurisdiction("EP")

                    .filedBy(competitor.getDisplayName())
                    .currentOwner(dto.getApplicant())

                    .filingType(dto.getKind())
                    .status("PUBLISHED")
                    .fetchedAt(LocalDateTime.now())
                    .build();


            filingRepository.save(filing);
            newFilings++;
        }

        return CompetitorSyncResult.builder()
                .competitorCode(competitor.getCode())
                .newFilings(newFilings)
                .duplicates(duplicates)
                .status("SUCCESS")
                .build();
    }

    private String extractCurrentOwner(PatentsViewResponseDocument doc) {
        if (doc.getPatentsViewAssignees() == null ||
                doc.getPatentsViewAssignees().isEmpty()) {
            return "N/A";
        }

        return doc.getPatentsViewAssignees().stream()
                .map(PatentsViewAssignee::getAssigneeOrganisation)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("N/A");
    }


}
