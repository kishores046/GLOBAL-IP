package com.teamb.globalipbackend1.service.patent.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewHttpClient;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponse;
import com.teamb.globalipbackend1.external.patentsview.mapper.PatentsViewMapStructMapper;
import com.teamb.globalipbackend1.external.patentsview.querybuilder.PatentsViewQueryBuilder;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentsViewSearchService {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewQueryBuilder queryBuilder;
    private final ObjectMapper objectMapper;
    private final PatentsViewMapStructMapper mapper;

    public List<PatentDocument> advancedSearch(PatentSearchFilter filter) {

        try {
            String queryJson = queryBuilder.buildAdvancedQuery(
                    filter.getKeyword(),
                    filter.getFilingDateFrom() != null ? filter.getFilingDateFrom().toString() : null,
                    filter.getFilingDateTo() != null ? filter.getFilingDateTo().toString() : null,
                    filter.getAssignee(),
                    filter.getInventor()
            );
            log.debug("PatentsView Advanced Query: {}", queryJson);

            String responseBody = httpClient.post(queryJson);

            PatentsViewResponse response =
                    objectMapper.readValue(responseBody, PatentsViewResponse.class);

            if (response == null || response.getResponseDocuments() == null) {
                return List.of();
            }

            return mapper.toPatentDocuments(response.getResponseDocuments());

        } catch (Exception e) {
            log.error("PatentsView advanced search failed", e);
            return List.of();
        }
    }


    public List<PatentDocument> searchPatentsByKeyword(String keyword, PatentSearchFilter filter) {
        log.info("Starting PatentsView patent search for keyword: {}", keyword);

        List<PatentDocument> results = new ArrayList<>();

        try {

            String queryJson = queryBuilder.buildAdvancedQuery(
                    keyword,
                    filter.getFilingDateFrom() != null ? filter.getFilingDateFrom().toString() : null,
                    filter.getFilingDateTo() != null ? filter.getFilingDateTo().toString() : null,
                    filter.getAssignee(),
                    filter.getInventor()
            );

            log.debug("PatentsView query: {}", queryJson);

            String responseBody = httpClient.post(queryJson);

            PatentsViewResponse response = objectMapper.readValue(
                    responseBody,
                    PatentsViewResponse.class
            );

            if (response == null || response.getResponseDocuments() == null) {
                log.warn("PatentsView returned no results for keyword: {}", keyword);
                return List.of();
            }

            log.info("PatentsView returned {} patents", response.getResponseDocuments().size());

            results = mapper.toPatentDocuments(response.getResponseDocuments());

            log.info("Successfully mapped {} patents from PatentsView", results.size());

        } catch (Exception e) {
            log.error("PatentsView search failed for keyword: {}", keyword, e);
        }
        return results;
    }
}