package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoDocumentId;
import com.teamb.globalipbackend1.external.epo.dto.EpoExchangeDocument;
import com.teamb.globalipbackend1.external.epo.mapper.EpoPatentMapper;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    /**
     * Search patents by keyword - returns raw results without filtering
     */
    public List<PatentDocument> searchPatents(String keyword) {
        log.info("Starting EPO patent search for keyword: {}", keyword);

        // Step 1: Get document IDs from search
        List<EpoDocumentId> ids = searchByKeyword(keyword);

        if (ids.isEmpty()) {
            log.warn("No publication IDs found for keyword: {}", keyword);
            return List.of();
        }

        log.info("Found {} document IDs from EPO search", ids.size());

        // Step 2: Fetch full bibliographic data for each ID
        List<PatentDocument> results = fetchPatentDetails(ids);

        log.info("EPO search completed. Total patents fetched: {}", results.size());

        return results;
    }

    /**
     * Search EPO by keyword and return document IDs
     */
    private List<EpoDocumentId> searchByKeyword(String keyword) {
        try {
            return epoClient.searchByTitle(keyword);
        } catch (Exception e) {
            log.error("EPO search failed for keyword: {}", keyword, e);
            throw new RuntimeException("EPO search failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch detailed patent information for each document ID
     */
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

                // Take the first document (already prioritized by kind in EpoClient)
                EpoExchangeDocument doc = documents.get(0);
                PatentDocument mapped = epoPatentMapper.map(doc);

                if (mapped != null) {
                    results.add(mapped);
                    log.debug("Successfully mapped patent: {}", mapped.getPublicationNumber());
                } else {
                    log.warn("Mapper returned null for {}{}{}",
                            id.getCountry(), id.getDocNumber(), id.getKind());
                }

            } catch (Exception ex) {
                log.warn("Failed to fetch/map document {}{}{}: {}",
                        id.getCountry(),
                        id.getDocNumber(),
                        id.getKind(),
                        ex.getMessage());
            }
        }

        return results;
    }
}