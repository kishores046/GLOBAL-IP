package com.teamb.globalipbackend1.service.patent.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.*;
import com.teamb.globalipbackend1.external.epo.mapper.EpoPatentMapper;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Service for searching patents from EPO (European Patent Office)
 * Handles only the I/O operations - filtering logic is in PatentFilterService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EPOPatentSearchService {

    private final EpoClient epoClient;
    private final EpoPatentMapper epoPatentMapper;
    private final PatentFilterService patentFilterService;

    public List<PatentDocument> searchPatents(String keyword) {
        log.info("Starting EPO patent search for keyword: {}", keyword);

        List<EpoDocumentId> ids = searchByKeyword(keyword);

        if (ids.isEmpty()) {
            log.warn("No publication IDs found for keyword: {}", keyword);
            return List.of();
        }

        log.info("Found {} document IDs from EPO search", ids.size());

        List<PatentDocument> results = fetchPatentDetails(ids);

        log.info("EPO search completed. Total patents fetched: {}", results.size());
        return results;
    }

    // Overloaded method that accepts a filter for jurisdiction-aware searching
    public List<PatentDocument> searchPatents(String keyword, String jurisdiction) {
        log.info("Starting EPO patent search for keyword: {} with jurisdiction: {}", keyword, jurisdiction);

        List<EpoDocumentId> ids = searchByKeywordWithJurisdiction(keyword, jurisdiction);

        if (ids.isEmpty()) {
            log.warn("No publication IDs found for keyword: {} in jurisdiction: {}", keyword, jurisdiction);
            return List.of();
        }

        log.info("Found {} document IDs from EPO search", ids.size());

        List<PatentDocument> results = fetchPatentDetails(ids);

        log.info("EPO search completed. Total patents fetched: {}", results.size());
        return results;
    }

    private List<EpoDocumentId> searchByKeyword(String keyword) {
        try {
            return epoClient.searchByTitle(keyword);
        } catch (Exception e) {
            log.error("EPO search failed for keyword: {}", keyword, e);
            throw new RuntimeException("EPO search failed", e);
        }
    }

    private List<EpoDocumentId> searchByKeywordWithJurisdiction(String keyword, String jurisdiction) {
        try {
            return epoClient.searchByTitleWithJurisdiction(keyword, jurisdiction);
        } catch (Exception e) {
            log.error("EPO search failed for keyword: {} with jurisdiction: {}", keyword, jurisdiction, e);
            throw new RuntimeException("EPO search failed", e);
        }
    }

    private List<PatentDocument> fetchPatentDetails(List<EpoDocumentId> ids) {

        List<PatentDocument> results = new ArrayList<>();

        for (EpoDocumentId id : ids) {

            try {

                List<EpoExchangeDocument> documents = epoClient.fetchBiblio(id);

                if (documents.isEmpty()) {
                    log.debug("No biblio data for {}{}{}",
                            id.getCountry(), id.getDocNumber(), id.getKind());
                    continue;
                }

                EpoExchangeDocument doc = documents.get(0);

                PatentDocument patent = epoPatentMapper.map(doc, id);
                if (patent == null) {
                    log.warn("Mapper returned null for {}{}{}",
                            id.getCountry(), id.getDocNumber(), id.getKind());
                    continue;
                }

                // Enrich with abstract - FIXED to use getFullText()
                enrichWithAbstract(patent, id);

                // Enrich with classifications
                enrichWithClassifications(patent, doc);

                results.add(patent);

            } catch (Exception ex) {
                log.warn("Failed to fetch/map patent {}{}{}",
                        id.getCountry(),
                        id.getDocNumber(),
                        id.getKind(),
                        ex);
            }
        }

        return results;
    }

    private void enrichWithAbstract(PatentDocument patent, EpoDocumentId id) {
        try {
            List<EpoAbstract> abstracts = epoClient.fetchAbstract(id);

            if (abstracts.isEmpty()) {
                log.debug("No abstracts available for {}", patent.getPublicationNumber());
                return;
            }

            // Try to get English abstract first using getFullText()
            String abstractText = abstracts.stream()
                    .filter(a -> a != null && "en".equalsIgnoreCase(a.getLang()))
                    .map(EpoAbstract::getFullText)  // FIXED: Use getFullText() instead of getValue()
                    .filter(v -> v != null && !v.isBlank())
                    .findFirst()
                    .orElseGet(() -> {
                        // Fallback to first available abstract
                        return abstracts.stream()
                                .filter(a -> a != null)
                                .map(EpoAbstract::getFullText)  // FIXED: Use getFullText()
                                .filter(v -> v != null && !v.isBlank())
                                .findFirst()
                                .orElse(null);
                    });

            if (abstractText != null) {
                patent.setAbstractText(abstractText);
                log.debug("Set abstract for {} (length: {})",
                        patent.getPublicationNumber(), abstractText.length());
            } else {
                log.debug("No valid abstract text found for {}", patent.getPublicationNumber());
            }

        } catch (Exception e) {
            log.debug("Abstract not available for {}: {}",
                    patent.getPublicationNumber(), e.getMessage());
        }
    }

    private void enrichWithClassifications(
            PatentDocument patent,
            EpoExchangeDocument doc
    ) {
        if (doc.getBibliographicData() == null) return;

        var biblio = doc.getBibliographicData();

        // Extract IPC classifications
        List<String> ipcCodes = biblio.getIpcList().stream()
                .filter(Objects::nonNull)
                .map(EpoIpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
        patent.setIpcClasses(ipcCodes);

        // Extract CPC classifications
        List<String> cpcCodes = biblio.getCpcList().stream()
                .filter(cpc -> cpc != null)
                .map(EpoCpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
        patent.setCpcClasses(cpcCodes);
    }

    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {
        log.info("Starting EPO advanced search with filter: {}", filter);

        List<EpoDocumentId> ids = epoClient.advancedSearch(filter);

        log.info("EPO advanced search returned {} document IDs", ids.size());

        List<PatentDocument> docs = fetchPatentDetails(ids);

        log.info("Fetched {} patent details, applying post-filters", docs.size());

        // Apply assignee and inventor filters (other filters already in CQL)
        List<PatentDocument> filtered = docs.stream()
                .filter(p -> patentFilterService.matchesAssignee(p, filter))
                .filter(p -> patentFilterService.matchesInventor(p, filter))
                .toList();

        log.info("After post-filtering: {} patents remain", filtered.size());

        return filtered;
    }
}