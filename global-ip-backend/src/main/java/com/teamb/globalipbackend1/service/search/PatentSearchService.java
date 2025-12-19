package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoDocumentId;
import com.teamb.globalipbackend1.external.epo.dto.EpoExchangeDocument;
import com.teamb.globalipbackend1.external.epo.mapper.EpoPatentMapper;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatentSearchService {

    private final EpoClient epoClient;
    private final EpoPatentMapper epoPatentMapper;

    public List<PatentDocument> searchPatents(String keyword) {

        log.info("Starting EPO patent search for keyword: {}", keyword);

        List<EpoDocumentId> ids = null;
        try {
            ids = epoClient.searchByTitle(keyword);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }

        if (ids.isEmpty()) {
            log.warn("No publication IDs found for keyword: {}", keyword);
            return List.of();
        }

        List<PatentDocument> results = new ArrayList<>();

        for (EpoDocumentId id : ids) {
            try {
                List<EpoExchangeDocument> documents =
                        epoClient.fetchBiblio(id);

                for (EpoExchangeDocument doc : documents) {
                    try {
                        PatentDocument mapped = epoPatentMapper.map(doc);
                        log.info("Mapped patent: {}", mapped.getPublicationNumber());

                        results.add(mapped);
                    } catch (Exception ex) {
                        log.warn(
                                "Skipping malformed OPS document {}{}{}",
                                id.getCountry(),
                                id.getDocNumber(),
                                id.getKind(),
                                ex
                        );
                    }
                }

            } catch (Exception e) {
                // OPS is flaky — skipping failures is normal
                log.warn(
                        "Failed to fetch biblio for {}{}{}",
                        id.getCountry(),
                        id.getDocNumber(),
                        id.getKind(),
                        e
                );
            }
        }

        log.info("EPO search completed. Total patents fetched: {}", results.size());
        return results;
    }

    public List<PatentDocument> searchWithFilters(PatentSearchFilter filter) {

        List<PatentDocument> baseResults =
                searchPatents(filter.getKeyword());

        log.info("Base results before filters: {}", baseResults.size());

        List<PatentDocument> filtered=baseResults.stream()
                .filter(p -> matchesJurisdiction(p, filter))
                .filter(p -> matchesFilingDate(p, filter))
                .filter(p -> matchesAssignee(p, filter))
                .filter(p -> matchesInventor(p, filter))
                .toList();
        log.info("Results after filters: {}", filtered.size());

        return filtered;
    }

    private boolean matchesJurisdiction(
            PatentDocument p,
            PatentSearchFilter f) {

        if (f.getJurisdiction() == null ||
                f.getJurisdiction().equalsIgnoreCase("ALL")) {
            return true;
        }

        return p.getJurisdiction() != null &&
                f.getJurisdiction().equalsIgnoreCase(p.getJurisdiction());

    }
    private boolean matchesFilingDate(
            PatentDocument p,
            PatentSearchFilter f) {

        LocalDate date = p.getPublicationDate();

        // If patent has no date, don't kill it
        if (date == null) return true;

        if (f.getFilingDateFrom() != null &&
                date.isBefore(f.getFilingDateFrom())) {
            return false;
        }

        return f.getFilingDateTo() == null ||
                !date.isAfter(f.getFilingDateTo());
    }

    private boolean matchesAssignee(
            PatentDocument p,
            PatentSearchFilter f) {
        log.info(
                "Patent {} publication date = {}",
                p.getPublicationNumber(),
                p.getPublicationDate()
        );


        if (f.getAssignee() == null || f.getAssignee().isBlank()) {
            return true;
        }


        if (p.getAssignees() == null || p.getAssignees().isEmpty()) {
            return true;
        }

        String q = f.getAssignee().toLowerCase();

        return p.getAssignees().stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .anyMatch(a -> a.contains(q));
    }

    private boolean matchesInventor(
            PatentDocument p,
            PatentSearchFilter f) {

        if (f.getInventor() == null || f.getInventor().isBlank()) {
            return true;
        }


        if (p.getInventors() == null || p.getInventors().isEmpty()) {
            return true;
        }

        String q = f.getInventor().toLowerCase();

        return p.getInventors().stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .anyMatch(i -> i.contains(q));
    }




}
