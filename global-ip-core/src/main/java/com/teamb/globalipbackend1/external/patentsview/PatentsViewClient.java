package com.teamb.globalipbackend1.external.patentsview;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.external.patentsview.config.PatentsViewProperties;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponse;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewResponseDocument;
import com.teamb.globalipbackend1.external.patentsview.querybuilder.PatentsViewQueryBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * High-level client for PatentsView API operations
 * Handles competitor filing queries and patent detail retrieval
 */
@Component
@Slf4j
public class PatentsViewClient {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewQueryBuilder queryBuilder;
    @Qualifier("jsonObjectMapper")
    private final ObjectMapper objectMapper;
    private final PatentsViewProperties properties;

    public PatentsViewClient(PatentsViewHttpClient httpClient, PatentsViewQueryBuilder queryBuilder, @Qualifier("jsonObjectMapper") ObjectMapper objectMapper, PatentsViewProperties properties) {
        this.httpClient = httpClient;
        this.queryBuilder = queryBuilder;
        this.objectMapper = objectMapper;
        this.properties = properties;
    }

    /**
     * Search patents by assignee organizations (for competitor tracking)
     *
     * @param assigneeOrganizations List of exact assignee names (e.g., "Google LLC", "Google Inc.")
     * @param fromDate Optional - filter patents from this date onwards
     * @return List of patent documents matching the criteria
     */
    public List<PatentsViewResponseDocument> searchByAssignees(
            List<String> assigneeOrganizations,
            LocalDate fromDate
    ) {
        if (assigneeOrganizations == null || assigneeOrganizations.isEmpty()) {
            log.warn("No assignee organizations provided for search");
            return Collections.emptyList();
        }

        try {
            log.info("Searching patents for {} assignees from date: {}",
                    assigneeOrganizations.size(), fromDate);

            // Build query
            String queryJson = queryBuilder.buildCompetitorFilingQuery(
                    assigneeOrganizations,
                    fromDate,
                    500  // Default page size
            );

            // Execute request
            String responseJson = httpClient.post(properties.apiUrl(), queryJson);

            // Parse response
            PatentsViewResponse response = objectMapper.readValue(
                    responseJson,
                    PatentsViewResponse.class
            );

            if (response.isError()) {
                log.error("PatentsView API returned error flag");
                return Collections.emptyList();
            }

            List<PatentsViewResponseDocument> documents = response.getResponseDocuments();
            log.info("Found {} patents for assignees: {}",
                    documents != null ? documents.size() : 0,
                    assigneeOrganizations);

            return documents != null ? documents : Collections.emptyList();

        } catch (Exception e) {
            log.error("Failed to search patents for assignees: {}", assigneeOrganizations, e);
            throw new PatentsViewException("Failed to search patents by assignees", e);
        }
    }

    /**
     * Search patents by single assignee organization
     */
    public List<PatentsViewResponseDocument> searchByAssignees(
            String assigneeOrganization,
            LocalDate fromDate
    ) {
        return searchByAssignees(List.of(assigneeOrganization), fromDate);
    }

    /**
     * Get specific patent by publication number
     *
     * @param publicationNumber Patent number (e.g., "10123456" or "US10123456")
     * @return Patent document or null if not found
     */
    public PatentsViewResponseDocument getPatentByNumber(String publicationNumber) {
        if (publicationNumber == null || publicationNumber.isEmpty()) {
            throw new IllegalArgumentException("Patent number is required");
        }

        try {
            log.info("Fetching patent details for: {}", publicationNumber);

            // Build query
            String queryJson = queryBuilder.buildPatentDetailQuery(publicationNumber);

            // Execute request
            String responseJson = httpClient.post(properties.apiUrl(), queryJson);

            // Parse response
            PatentsViewResponse response = objectMapper.readValue(
                    responseJson,
                    PatentsViewResponse.class
            );

            if (response.isError()) {
                log.error("PatentsView API returned error for patent: {}", publicationNumber);
                return null;
            }

            List<PatentsViewResponseDocument> documents = response.getResponseDocuments();

            if (documents == null || documents.isEmpty()) {
                log.warn("Patent not found: {}", publicationNumber);
                return null;
            }

            return documents.get(0);

        } catch (Exception e) {
            log.error("Failed to fetch patent: {}", publicationNumber, e);
            throw new PatentsViewException("Failed to fetch patent by number", e);
        }
    }

    /**
     * Advanced search with multiple criteria (preserved from original implementation)
     */
    public List<PatentsViewResponseDocument> advancedSearch(
            String keyword,
            String fromDate,
            String toDate,
            String assignee,
            String inventor
    ) {
        try {
            log.info("Advanced search - keyword: {}, assignee: {}, inventor: {}",
                    keyword, assignee, inventor);

            // Build query
            String queryJson = queryBuilder.buildAdvancedQuery(
                    keyword, fromDate, toDate, assignee, inventor
            );

            // Execute request
            String responseJson = httpClient.post(properties.apiUrl(), queryJson);

            // Parse response
            PatentsViewResponse response = objectMapper.readValue(
                    responseJson,
                    PatentsViewResponse.class
            );

            if (response.isError()) {
                log.error("PatentsView API returned error for advanced search");
                return Collections.emptyList();
            }

            List<PatentsViewResponseDocument> documents = response.getResponseDocuments();
            log.info("Advanced search found {} patents",
                    documents != null ? documents.size() : 0);

            return documents != null ? documents : Collections.emptyList();

        } catch (Exception e) {
            log.error("Advanced search failed", e);
            throw new PatentsViewException("Advanced search failed", e);
        }
    }

    /**
     * Get recent patents for an assignee (last N days)
     */
    public List<PatentsViewResponseDocument> getRecentPatents(
            String assigneeOrganization,
            int daysBack
    ) {
        LocalDate fromDate = LocalDate.now().minusDays(daysBack);
        return searchByAssignees(assigneeOrganization, fromDate);
    }

    /**
     * Get patents for multiple assignees in a date range
     */
    public List<PatentsViewResponseDocument> searchByAssigneesInRange(
            List<String> assigneeOrganizations,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        // Note: PatentsView v1 API doesn't directly support toDate in the same query
        // This is a limitation - we fetch all patents >= fromDate
        // Additional filtering needed in the service layer if toDate is critical

        List<PatentsViewResponseDocument> documents = searchByAssignees(
                assigneeOrganizations,
                fromDate
        );

        // Filter by toDate if provided (in-memory filtering)
        if (toDate != null) {
            return documents.stream()
                    .filter(doc -> doc.getPatentDate() != null &&
                            !doc.getPatentDate().isAfter(toDate))
                    .toList();
        }

        return documents;
    }
}

/**
 * Custom exception for PatentsView API errors
 */
class PatentsViewException extends RuntimeException {
    public PatentsViewException(String message) {
        super(message);
    }

    public PatentsViewException(String message, Throwable cause) {
        super(message, cause);
    }
}