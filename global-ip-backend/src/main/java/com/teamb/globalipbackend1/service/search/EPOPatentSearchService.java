package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoCpcClassification;
import com.teamb.globalipbackend1.external.epo.dto.EpoDocumentId;
import com.teamb.globalipbackend1.external.epo.dto.EpoExchangeDocument;
import com.teamb.globalipbackend1.external.epo.dto.EpoIpcClassification;
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
    private final PatentFilterService patentFilterService;

    public List<PatentDocument> searchPatents(String keyword) {
        log.info("Starting EPO patent searchByKeyword for keyword: {}", keyword);

        List<EpoDocumentId> ids = searchByKeyword(keyword);

        if (ids.isEmpty()) {
            log.warn("No publication IDs found for keyword: {}", keyword);
            return List.of();
        }

        log.info("Found {} document IDs from EPO searchByKeyword", ids.size());

        List<PatentDocument> results = fetchPatentDetails(ids);

        log.info("EPO searchByKeyword completed. Total patents fetched: {}", results.size());
        return results;
    }

    private List<EpoDocumentId> searchByKeyword(String keyword) {
        try {
            return epoClient.searchByTitle(keyword);
        } catch (Exception e) {
            log.error("EPO searchByKeyword failed for keyword: {}", keyword, e);
            throw new RuntimeException("EPO searchByKeyword failed", e);
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

                EpoExchangeDocument doc = documents.getFirst();

                PatentDocument patent = epoPatentMapper.map(doc);
                if (patent == null) {
                    log.warn("Mapper returned null for {}{}{}",
                            id.getCountry(), id.getDocNumber(), id.getKind());
                    continue;
                }


                enrichWithAbstract(patent, id);


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
            var abstracts = epoClient.fetchAbstract(id);

            abstracts.stream()
                    .filter(a -> "en".equalsIgnoreCase(a.getLang()))
                    .findFirst()
                    .ifPresent(a -> patent.setAbstractText(a.getValue()));

        } catch (Exception e) {
            log.debug("Abstract not available for {}", patent.getPublicationNumber());
        }
    }

    private void enrichWithClassifications(
            PatentDocument patent,
            EpoExchangeDocument doc
    ) {
        if (doc.getBibliographicData() == null) return;

        var biblio = doc.getBibliographicData();


        List<String> ipcCodes = biblio.getIpcList().stream()
                .map(EpoIpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
        patent.setIpcClasses(ipcCodes);

        List<String> cpcCodes = biblio.getCpcList().stream()
                .map(EpoCpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
        patent.setCpcClasses(cpcCodes);
    }

    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {

        List<EpoDocumentId> ids = epoClient.advancedSearch(filter);

        List<PatentDocument> docs = fetchPatentDetails(ids);


        return docs.stream()
                .filter(p -> patentFilterService.matchesAssignee(p, filter))
                .filter(p -> patentFilterService.matchesInventor(p, filter))
                .toList();
    }


}
