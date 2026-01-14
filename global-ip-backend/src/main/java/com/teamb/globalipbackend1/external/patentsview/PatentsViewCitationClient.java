package com.teamb.globalipbackend1.external.patentsview;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.external.patentsview.dto.*;
import com.teamb.globalipbackend1.external.patentsview.querybuilder.PatentsViewCitationQueryBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component

@Slf4j
public class PatentsViewCitationClient {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewCitationQueryBuilder queryBuilder;
    @Qualifier("jsonObjectMapper")
    private final ObjectMapper objectMapper;

    private static final String US_PATENT_CITATION_ENDPOINT =
            "https://search.patentsview.org/api/v1/patent/us_patent_citation";
    private static final String US_APPLICATION_CITATION_ENDPOINT =
            "https://search.patentsview.org/api/v1/patent/us_application_citation";
    private static final String FOREIGN_CITATION_ENDPOINT =
            "https://search.patentsview.org/api/v1/patent/foreign_citation";

    public PatentsViewCitationClient(PatentsViewHttpClient httpClient, PatentsViewCitationQueryBuilder queryBuilder,@Qualifier("jsonObjectMapper") ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.queryBuilder = queryBuilder;
        this.objectMapper = objectMapper;
    }

    /**
     * Get backward citations (what THIS patent cites)
     * Returns just the list for EnhancedCitationNetworkService
     */
    public List<PatentsViewUSPatentCitation> getBackwardCitations(String patentId) {
        try {
            String queryJson = queryBuilder.buildBackwardCitationsQuery(patentId);
            log.info("Fetching backward citations for patent: {}", patentId);

            String responseJson = httpClient.post(US_PATENT_CITATION_ENDPOINT, queryJson);

            PatentsViewUSPatentCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewUSPatentCitationResponse.class);

            if (response.getUsPatentCitations() == null) {
                log.info("No backward citations found for patent: {}", patentId);
                return new ArrayList<>();
            }

            log.info("Found {} backward citations for {}",
                    response.getUsPatentCitations().size(), patentId);

            return response.getUsPatentCitations();

        } catch (Exception e) {
            log.error("Error fetching backward citations for {}: {}", patentId, e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Get forward citations (who cites THIS patent)
     * Returns just the list for EnhancedCitationNetworkService
     */
    public List<PatentsViewUSPatentCitation> getForwardCitations(String patentId) {
        try {
            String queryJson = queryBuilder.buildForwardCitationsQuery(patentId);
            log.info("Fetching forward citations for patent: {}", patentId);

            String responseJson = httpClient.post(US_PATENT_CITATION_ENDPOINT, queryJson);

            PatentsViewUSPatentCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewUSPatentCitationResponse.class);

            if (response.getUsPatentCitations() == null) {
                log.info("No forward citations found for patent: {}", patentId);
                return new ArrayList<>();
            }

            log.info("Found {} forward citations for {}",
                    response.getUsPatentCitations().size(), patentId);

            return response.getUsPatentCitations();

        } catch (Exception e) {
            log.error("Error fetching forward citations for {}: {}", patentId, e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Get backward citations response (for PatentCitationService - database storage)
     */
    public PatentsViewUSPatentCitationResponse getBackwardCitationsResponse(String patentId) {
        try {
            String queryJson = queryBuilder.buildBackwardCitationsQuery(patentId);
            String responseJson = httpClient.post(US_PATENT_CITATION_ENDPOINT, queryJson);

            PatentsViewUSPatentCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewUSPatentCitationResponse.class);

            if (response.getUsPatentCitations() == null) {
                response.setUsPatentCitations(new ArrayList<>());
            }
            return response;

        } catch (Exception e) {
            log.error("Error fetching backward citations for {}: {}", patentId, e.getMessage());
            PatentsViewUSPatentCitationResponse emptyResponse = new PatentsViewUSPatentCitationResponse();
            emptyResponse.setUsPatentCitations(new ArrayList<>());
            emptyResponse.setCount(0);
            return emptyResponse;
        }
    }

    /**
     * Get forward citations response (for PatentCitationService - database storage)
     */
    public PatentsViewUSPatentCitationResponse getForwardCitationsResponse(String patentId) {
        try {
            String queryJson = queryBuilder.buildForwardCitationsQuery(patentId);
            String responseJson = httpClient.post(US_PATENT_CITATION_ENDPOINT, queryJson);

            PatentsViewUSPatentCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewUSPatentCitationResponse.class);

            if (response.getUsPatentCitations() == null) {
                response.setUsPatentCitations(new ArrayList<>());
            }
            return response;

        } catch (Exception e) {
            log.error("Error fetching forward citations for {}: {}", patentId, e.getMessage());
            PatentsViewUSPatentCitationResponse emptyResponse = new PatentsViewUSPatentCitationResponse();
            emptyResponse.setUsPatentCitations(new ArrayList<>());
            emptyResponse.setCount(0);
            return emptyResponse;
        }
    }

    /**
     * Get US application citations
     */
    public PatentsViewUSApplicationCitationResponse getApplicationCitations(String patentId) {
        try {
            String queryJson = queryBuilder.buildApplicationCitationsQuery(patentId);

            String responseJson = httpClient.post(US_APPLICATION_CITATION_ENDPOINT, queryJson);

            PatentsViewUSApplicationCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewUSApplicationCitationResponse.class);

            if (response.getUsApplicationCitations() == null) {
                response.setUsApplicationCitations(new ArrayList<>());
            }

            log.info("Found {} application citations for {}",
                    response.getUsApplicationCitations().size(), patentId);

            return response;

        } catch (Exception e) {
            log.error("Error fetching application citations: {}", e.getMessage());
            PatentsViewUSApplicationCitationResponse emptyResponse = new PatentsViewUSApplicationCitationResponse();
            emptyResponse.setUsApplicationCitations(new ArrayList<>());
            emptyResponse.setCount(0);
            return emptyResponse;
        }
    }

    /**
     * Get foreign citations
     */
    public PatentsViewForeignCitationResponse getForeignCitations(String patentId) {
        try {
            String queryJson = queryBuilder.buildForeignCitationsQuery(patentId);

            String responseJson = httpClient.post(FOREIGN_CITATION_ENDPOINT, queryJson);

            PatentsViewForeignCitationResponse response =
                    objectMapper.readValue(responseJson, PatentsViewForeignCitationResponse.class);

            // Check if API returned error
            if (response.getError() != null && response.getError()) {
                log.warn("API returned error for foreign citations query for patent: {}", patentId);
                response.setForeignCitations(new ArrayList<>());
                response.setCount(0);
                return response;
            }

            if (response.getForeignCitations() == null) {
                response.setForeignCitations(new ArrayList<>());
            }

            log.info("Found {} foreign citations for {}",
                    response.getForeignCitations().size(), patentId);

            return response;

        } catch (Exception e) {
            log.error("Error fetching foreign citations: {}", e.getMessage());
            PatentsViewForeignCitationResponse emptyResponse = new PatentsViewForeignCitationResponse();
            emptyResponse.setForeignCitations(new ArrayList<>());
            emptyResponse.setCount(0);
            return emptyResponse;
        }
    }

    /**
     * Get ALL citations for a patent (for PatentCitationService - database storage)
     */
    public AllCitationsResponse getAllCitations(String patentId) {
        log.info("Fetching all citations for patent: {}", patentId);

        AllCitationsResponse allCitations = new AllCitationsResponse();

        // Backward US patent citations
        PatentsViewUSPatentCitationResponse backward = getBackwardCitationsResponse(patentId);
        allCitations.setBackwardUSPatentCitations(backward.getUsPatentCitations());

        // Forward US patent citations
        PatentsViewUSPatentCitationResponse forward = getForwardCitationsResponse(patentId);
        allCitations.setForwardUSPatentCitations(forward.getUsPatentCitations());

        // US application citations
        PatentsViewUSApplicationCitationResponse applications = getApplicationCitations(patentId);
        allCitations.setUsApplicationCitations(applications.getUsApplicationCitations());

        // Foreign citations
        PatentsViewForeignCitationResponse foreign = getForeignCitations(patentId);
        allCitations.setForeignCitations(foreign.getForeignCitations());

        log.info("Total citations for {}: {} backward, {} forward",
                patentId,
                allCitations.getTotalBackwardCount(),
                allCitations.getTotalForwardCount());

        return allCitations;
    }
}