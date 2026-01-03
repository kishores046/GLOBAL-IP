package com.teamb.globalipbackend1.external.patentsview.querybuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class PatentsViewQueryBuilder {

    private final ObjectMapper mapper = new ObjectMapper();

    public String buildAdvancedQuery(
            String keyword,
            String fromDate,
            String toDate,
            String assignee,
            String inventor
    ) {
        ObjectNode root = mapper.createObjectNode();
        ArrayNode andArray = mapper.createArrayNode();


        if (keyword != null && !keyword.isBlank()) {

            ArrayNode orArray = mapper.createArrayNode();
            orArray.add(textAny("patent_title", keyword));
            orArray.add(textAny("patent_abstract", keyword));

            ObjectNode orNode = mapper.createObjectNode();
            orNode.set("_or", orArray);
            andArray.add(orNode);
        }

        if (fromDate != null && !fromDate.isBlank()) {
            andArray.add(gte("patent_earliest_application_date", fromDate));
        }

        if (toDate != null && !toDate.isBlank()) {
            andArray.add(lte("patent_earliest_application_date", toDate));
        }

        if (assignee != null && !assignee.isBlank()) {
            // Use correct field name for v1 API
            andArray.add(textAny("assignees.assignee_organization", assignee));
        }

        if (inventor != null && !inventor.isBlank()) {
            // Search in inventor last name - correct field name for v1 API
            andArray.add(textAny("inventors.inventor_name_last", inventor));
        }

        if (andArray.isEmpty()) {
            throw new IllegalArgumentException("PatentsView query must contain at least one condition");
        }

        ObjectNode query = mapper.createObjectNode();
        query.set("_and", andArray);
        root.set("q", query);


        root.putArray("f")

                .add("patent_id")


                .add("patent_title")
                .add("patent_abstract")


                .add("patent_date") // grant date
                .add("patent_earliest_application_date") // filing date


                .add("assignees.assignee_organization")
                .add("inventors.inventor_name_first")
                .add("inventors.inventor_name_last")

                // Classification
                .add("cpc_current.cpc_class")
                .add("cpc_current.cpc_subclass")
                .add("cpc_current.cpc_group")

                // Analytics (cheap, useful)
                .add("wipo_kind")
                .add("patent_num_times_cited_by_us_patents")
                .add("patent_num_total_documents_cited");
        root.putObject("o").put("size", 1000);

        return root.toString();
    }

    /**
     * Use _text_any for full-text searchByKeyword on text fields
     * This searches for any of the words in the value
     */
    private ObjectNode textAny(String field, String value) {
        return mapper.createObjectNode()
                .set("_text_any",
                        mapper.createObjectNode().put(field, value));
    }

    private ObjectNode gte(String field, String value) {
        return mapper.createObjectNode()
                .set("_gte",
                        mapper.createObjectNode().put(field, value));
    }

    private ObjectNode lte(String field, String value) {
        return mapper.createObjectNode()
                .set("_lte",
                        mapper.createObjectNode().put(field, value));
    }
    public String buildPatentDetailQuery(String publicationNumber) {

        String patentId = normalizeToPatentId(publicationNumber);

        ObjectNode root = mapper.createObjectNode();
        ObjectNode q = root.putObject("q");

        ObjectNode eq = mapper.createObjectNode();
        eq.put("patent_id", patentId);

        ObjectNode andItem = mapper.createObjectNode();
        andItem.set("_eq", eq);

        q.putArray("_and").add(andItem);

        root.putArray("f").addAll(List.of(
                // Identity
                text("patent_id"),

                // Core
                text("patent_title"),
                text("patent_abstract"),

                // Dates
                text("patent_date"), // grant date
                text("patent_earliest_application_date"), // filing date

                // Parties
                text("assignees.assignee_organization"),
                text("inventors.inventor_name_first"),
                text("inventors.inventor_name_last"),

                // Classification
                text("cpc_current.cpc_class"),
                text("cpc_current.cpc_subclass"),
                text("cpc_current.cpc_group"),


                text("wipo_kind"),
                text("patent_num_times_cited_by_us_patents"),
                text("patent_num_total_documents_cited")
        ));


        root.put("o", 0);
        root.put("s", 1);

        return root.toString();
    }

    private JsonNode text(String v) {
        return mapper.getNodeFactory().textNode(v);
    }

    private String normalizeToPatentId(String input) {
        String n = input.trim().toUpperCase();


        if (n.matches("^US\\d+[A-Z]\\d?$")) {
            return n;
        }


        if (n.matches("^\\d{7,8}$")) {
            return "US" + n + "B2";
        }

        throw new IllegalArgumentException("Unsupported patent format: " + input);
    }


}