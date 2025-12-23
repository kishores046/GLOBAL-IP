package com.teamb.globalipbackend1.service.search;


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

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentsViewSearchService {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewQueryBuilder queryBuilder;
    private final ObjectMapper objectMapper;
    private final PatentsViewMapStructMapper mapper;

    public List<PatentDocument> advancedSearch(
           PatentSearchFilter patentSearchFilter
    ) {
        String queryJson = queryBuilder.buildAdvancedQuery(
                patentSearchFilter.getKeyword(),patentSearchFilter.getFilingDateFrom().toString(),patentSearchFilter.getFilingDateTo().toString(), patentSearchFilter.getAssignee(),patentSearchFilter.getInventor()
        );


        PatentsViewResponse patentsViewResponse=objectMapper.readValue(httpClient.post(queryJson), PatentsViewResponse.class);
        return mapper.toPatentDocuments(patentsViewResponse.getResponseDocuments());


    }

    public List<PatentDocument> searchPatents(String keyword) {
        log.info("Starting PatentsView patent search for keyword: {}", keyword);

        try {
            // Build simple keyword search query
            String queryJson = buildSimpleKeywordQuery(keyword);

            log.debug("PatentsView query: {}", queryJson);

            // Make API call
            String responseBody = httpClient.post(queryJson);

            // Parse response
            PatentsViewResponse response = objectMapper.readValue(
                    responseBody,
                    PatentsViewResponse.class
            );

            if (response == null || response.getResponseDocuments() == null) {
                log.warn("PatentsView returned no results for keyword: {}", keyword);
                return List.of();
            }

            log.info("PatentsView returned {} patents", response.getResponseDocuments().size());

            List<PatentDocument> results = mapper.toPatentDocuments(response.getResponseDocuments());

            log.info("Successfully mapped {} patents from PatentsView", results.size());

            return results;

        } catch (Exception e) {
            log.error("PatentsView search failed for keyword: {}", keyword, e);
            throw new RuntimeException("PatentsView search failed: " + e.getMessage(), e);
        }
    }

    /**
     * Build a simple keyword-only query for text search
     * Filters will be applied later by PatentFilterService
     */
    private String buildSimpleKeywordQuery(String keyword) {
        // Use your existing query builder but with only keyword
        // Pass nulls for other parameters since filtering happens separately
        return queryBuilder.buildAdvancedQuery(
                keyword,  // keyword
                null,     // fromDate - will be filtered later
                null,     // toDate - will be filtered later
                null,     // assignee - will be filtered later
                null      // inventor - will be filtered later
        );
    }
}

