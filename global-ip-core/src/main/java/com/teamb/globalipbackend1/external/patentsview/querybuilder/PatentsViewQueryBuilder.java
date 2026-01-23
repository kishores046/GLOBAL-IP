package com.teamb.globalipbackend1.external.patentsview.querybuilder;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class PatentsViewQueryBuilder {

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Build query for competitor filings - FINAL CORRECTED VERSION
     * Based on working Swagger UI format
     */
    public String buildCompetitorFilingQuery(
            List<String> assigneeOrganizations,
            LocalDate fromDate,
            Integer pageSize
    ) {
        if (assigneeOrganizations == null || assigneeOrganizations.isEmpty()) {
            throw new IllegalArgumentException("At least one assignee organization is required");
        }

        ObjectNode root = mapper.createObjectNode();
        ObjectNode queryRoot = mapper.createObjectNode();
        ArrayNode andArray = mapper.createArrayNode();


        if (assigneeOrganizations.size() == 1) {
            ObjectNode textAny = mapper.createObjectNode();
            ObjectNode field = mapper.createObjectNode();
            field.put("assignees.assignee_organization", assigneeOrganizations.getFirst());
            textAny.set("_text_any", field);
            andArray.add(textAny);
        } else {
            ArrayNode orArray = mapper.createArrayNode();
            for (String assignee : assigneeOrganizations) {
                ObjectNode textAny = mapper.createObjectNode();
                ObjectNode field = mapper.createObjectNode();
                String normalized = assignee
                        .replace(".", "")
                        .toUpperCase()
                        .trim();

                field.put("assignees.assignee_organization", normalized);
                textAny.set("_text_any", field);
                orArray.add(textAny);
            }

            ObjectNode orNode = mapper.createObjectNode();
            orNode.set("_or", orArray);
            andArray.add(orNode);
        }

        // Date filter
        if (fromDate != null) {
            ObjectNode gteNode = mapper.createObjectNode();
            ObjectNode dateField = mapper.createObjectNode();
            dateField.put("patent_date", fromDate.toString());
            gteNode.set("_gte", dateField);
            andArray.add(gteNode);
        }

        queryRoot.set("_and", andArray);
        root.set("q", queryRoot);

        // Fields
        root.putArray("f")
                .add("patent_id")
                .add("patent_title")
                .add("patent_abstract")
                .add("patent_date")
                .add("patent_earliest_application_date")
                .add("assignees.assignee_organization")
                .add("assignees.assignee_country")
                .add("inventors.inventor_name_first")
                .add("inventors.inventor_name_last")
                .add("cpc_current.cpc_class")
                .add("cpc_current.cpc_subclass")
                .add("cpc_current.cpc_group")
                .add("ipcr.ipc_class")
                .add("wipo_kind")
                .add("patent_num_times_cited_by_us_patents")
                .add("patent_num_total_documents_cited");


        ObjectNode options = root.putObject("o");
        options.put("size", pageSize != null ? pageSize : 100);
        options.put("page", 1);


        ArrayNode sort = root.putArray("s");
        ObjectNode sortNode = mapper.createObjectNode();
        sortNode.put("patent_date", "desc");
        sort.add(sortNode);

        return root.toString();
    }

    /**
     * Build query for specific patent by ID
     */
    public String buildPatentDetailQuery(String publicationNumber) {
        String patentId = normalizeToPatentId(publicationNumber);

        ObjectNode root = mapper.createObjectNode();
        ObjectNode queryRoot = mapper.createObjectNode();
        ArrayNode andArray = mapper.createArrayNode();

        ObjectNode textPhrase = mapper.createObjectNode();
        ObjectNode field = mapper.createObjectNode();
        field.put("patent_id", patentId);
        textPhrase.set("_text_phrase", field);
        andArray.add(textPhrase);

        queryRoot.set("_and", andArray);
        root.set("q", queryRoot);

        ArrayNode fields = root.putArray("f");
        fields.add("patent_id");
        fields.add("patent_title");
        fields.add("patent_abstract");
        fields.add("patent_date");
        fields.add("patent_earliest_application_date");
        fields.add("assignees.assignee_organization");
        fields.add("assignees.assignee_country");
        fields.add("inventors.inventor_name_first");
        fields.add("inventors.inventor_name_last");
        fields.add("cpc_current.cpc_class");
        fields.add("cpc_current.cpc_subclass");
        fields.add("cpc_current.cpc_group");
        fields.add("ipcr.ipc_class");
        fields.add("wipo_kind");
        fields.add("patent_num_times_cited_by_us_patents");
        fields.add("patent_num_total_documents_cited");

        ObjectNode options = root.putObject("o");
        options.put("size", 1);

        ArrayNode sort = root.putArray("s");
        ObjectNode sortNode = mapper.createObjectNode();
        sortNode.put("patent_date", "desc");
        sort.add(sortNode);
        return root.toString();
    }

    /**
     * Original advanced search query
     */
    public String buildAdvancedQuery(
            String keyword,
            String fromDate,
            String toDate,
            String assignee,
            String inventor
    ) {
        ObjectNode root = mapper.createObjectNode();
        ObjectNode queryRoot = mapper.createObjectNode();
        ArrayNode andArray = mapper.createArrayNode();

        if (keyword != null && !keyword.isBlank()) {
            ArrayNode orArray = mapper.createArrayNode();

            ObjectNode titleSearch = mapper.createObjectNode();
            ObjectNode titleField = mapper.createObjectNode();
            titleField.put("patent_title", keyword);
            titleSearch.set("_text_any", titleField);
            orArray.add(titleSearch);

            ObjectNode abstractSearch = mapper.createObjectNode();
            ObjectNode abstractField = mapper.createObjectNode();
            abstractField.put("patent_abstract", keyword);
            abstractSearch.set("_text_any", abstractField);
            orArray.add(abstractSearch);

            ObjectNode orNode = mapper.createObjectNode();
            orNode.set("_or", orArray);
            andArray.add(orNode);
        }

        if (fromDate != null && !fromDate.isBlank()) {
            ObjectNode gteNode = mapper.createObjectNode();
            ObjectNode dateField = mapper.createObjectNode();
            dateField.put("patent_earliest_application_date", fromDate);
            gteNode.set("_gte", dateField);
            andArray.add(gteNode);
        }

        if (toDate != null && !toDate.isBlank()) {
            ObjectNode lteNode = mapper.createObjectNode();
            ObjectNode dateField = mapper.createObjectNode();
            dateField.put("patent_earliest_application_date", toDate);
            lteNode.set("_lte", dateField);
            andArray.add(lteNode);
        }

        if (assignee != null && !assignee.isBlank()) {
            ObjectNode textAny = mapper.createObjectNode();
            ObjectNode field = mapper.createObjectNode();
            field.put("assignees.assignee_organization", assignee);
            textAny.set("_text_any", field);
            andArray.add(textAny);
        }

        if (inventor != null && !inventor.isBlank()) {
            ObjectNode textAny = mapper.createObjectNode();
            ObjectNode field = mapper.createObjectNode();
            field.put("inventors.inventor_name_last", inventor);
            textAny.set("_text_any", field);
            andArray.add(textAny);
        }

        if (andArray.isEmpty()) {
            throw new IllegalArgumentException("PatentsView query must contain at least one condition");
        }

        queryRoot.set("_and", andArray);
        root.set("q", queryRoot);

        ArrayNode fields = root.putArray("f");
        fields.add("patent_id");
        fields.add("patent_title");
        fields.add("patent_abstract");
        fields.add("patent_date");
        fields.add("patent_earliest_application_date");
        fields.add("assignees.assignee_organization");
        fields.add("inventors.inventor_name_first");
        fields.add("inventors.inventor_name_last");
        fields.add("cpc_current.cpc_class");
        fields.add("cpc_current.cpc_subclass");
        fields.add("cpc_current.cpc_group");
        fields.add("wipo_kind");
        fields.add("patent_num_times_cited_by_us_patents");
        fields.add("patent_num_total_documents_cited");

        ObjectNode options = root.putObject("o");
        options.put("size", 1000);


        ArrayNode sort = root.putArray("s");
        ObjectNode sortNode = mapper.createObjectNode();
        sortNode.put("patent_date", "desc");
        sort.add(sortNode);

        return root.toString();
    }

    private String normalizeToPatentId(String input) {
        String n = input.trim().toUpperCase();

        if (n.startsWith("US")) {
            n = n.substring(2);
        }

        n = n.replaceAll("[-\\s]", "");

        if (n.matches("^\\d{7,8}$")) {
            return n;
        }

        if (n.matches("^\\d{7,8}[A-Z]\\d?$")) {
            return n;
        }

        throw new IllegalArgumentException(
                "Invalid patent format: " + input +
                        ". Expected format: 10123456 or 10123456B2 (without US prefix)"
        );
    }
}