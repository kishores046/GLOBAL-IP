package com.teamb.globalipbackend1.external.patentsview.querybuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PatentsViewCitationQueryBuilder {

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Build query to get backward citations (what THIS patent cites)
     * Query by patent_id to get patents that THIS patent cites
     */
    public String buildBackwardCitationsQuery(String patentId) {
        String normalizedId = normalizeToPatentId(patentId);
        log.info("Building backward citations query for patent: {}", normalizedId);

        ObjectNode root = mapper.createObjectNode();

        // Query structure - search by patent_id
        ObjectNode query = mapper.createObjectNode();
        query.put("patent_id", normalizedId);
        root.set("q", query);

        // Fields
        root.putArray("f")
                .add("patent_id")
                .add("citation_patent_id")
                .add("citation_sequence")
                .add("citation_category")
                .add("citation_date");

        // Options
        root.putObject("o")
                .put("size", 100);

        // Sort
        root.putArray("s")
                .add(mapper.createObjectNode().put("citation_sequence", "asc"));

        String queryJson = root.toString();
        log.debug("Backward citations query JSON: {}", queryJson);
        return queryJson;
    }

    /**
     * Build query to get forward citations (who cites THIS patent)
     * Query by citation_patent_id using PatentsView DSL
     */
    public String buildForwardCitationsQuery(String patentId) {
        String normalizedId = normalizeToPatentId(patentId);
        log.info("Building forward citations query for patent: {}", normalizedId);

        ObjectNode root = mapper.createObjectNode();

        // q: { _eq: { citation_patent_id: "10004582" } }
        ObjectNode q = mapper.createObjectNode();
        ObjectNode eq = mapper.createObjectNode();
        eq.put("citation_patent_id", normalizedId);
        q.set("_eq", eq);
        root.set("q", q);

        // fields
        root.putArray("f")
                .add("patent_id")              // citing patent
                .add("citation_patent_id")     // cited patent (this one)
                .add("citation_sequence")
                .add("citation_category")
                .add("citation_date");

        // options
        root.putObject("o")
                .put("size", 100);

        // sort (recommended by API)
        root.putArray("s")
                .add(mapper.createObjectNode().put("patent_id", "asc"))
                .add(mapper.createObjectNode().put("citation_sequence", "asc"));

        String queryJson = root.toString();
        log.debug("Forward citations query JSON: {}", queryJson);
        return queryJson;
    }


    /**
     * Build query for US application citations
     */
    public String buildApplicationCitationsQuery(String patentId) {
        String normalizedId = normalizeToPatentId(patentId);
        log.info("Building application citations query for patent: {}", normalizedId);

        ObjectNode root = mapper.createObjectNode();

        ObjectNode query = mapper.createObjectNode();
        query.put("patent_id", normalizedId);
        root.set("q", query);

        root.putArray("f")
                .add("patent_id")
                .add("citation_document_number")
                .add("citation_sequence")
                .add("citation_category")
                .add("citation_date")
                .add("citation_name")
                .add("citation_wipo_kind");

        root.putObject("o")
                .put("size", 100);

        String queryJson = root.toString();
        log.debug("Application citations query JSON: {}", queryJson);
        return queryJson;
    }

    /**
     * Build query for foreign citations
     */
    public String buildForeignCitationsQuery(String patentId) {
        String normalizedId = normalizeToPatentId(patentId);
        log.info("Building foreign citations query for patent: {}", normalizedId);

        ObjectNode root = mapper.createObjectNode();

        ObjectNode query = mapper.createObjectNode();
        query.put("patent_id", normalizedId);
        root.set("q", query);

        root.putArray("f")
                .add("patent_id")
                .add("citation_number")
                .add("citation_sequence")
                .add("citation_category")
                .add("citation_date")
                .add("citation_country");

        root.putObject("o")
                .put("size", 100);

        String queryJson = root.toString();
        log.debug("Foreign citations query JSON: {}", queryJson);
        return queryJson;
    }

    /**
     * Normalize patent ID (remove US prefix, hyphens, spaces)
     */
    private String normalizeToPatentId(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Patent number cannot be empty");
        }

        String n = input.trim().toUpperCase();

        // Remove "US" prefix if present
        if (n.startsWith("US")) {
            n = n.substring(2);
        }

        // Remove hyphens and spaces
        n = n.replaceAll("[-\\s]", "");

        // Validate format
        if (!n.matches("^\\d{7,8}[A-Z]?\\d?$")) {
            log.warn("Invalid patent format: {} -> normalized to: {}", input, n);
            throw new IllegalArgumentException(
                    "Invalid patent format: " + input +
                            ". Expected: 10123456 or 10123456B2"
            );
        }

        log.debug("Normalized patent ID: {} -> {}", input, n);
        return n;
    }
}