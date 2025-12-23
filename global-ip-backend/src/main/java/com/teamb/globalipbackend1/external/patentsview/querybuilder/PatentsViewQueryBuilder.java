package com.teamb.globalipbackend1.external.patentsview.querybuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

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
        ObjectNode query = mapper.createObjectNode();
        var andArray = mapper.createArrayNode();

        if (keyword != null && !keyword.isBlank()) {
            andArray.add(textAny("patent_title", keyword));
        }

        if (fromDate != null) {
            andArray.add(gte("patent_date", fromDate));
        }

        if (toDate != null) {
            andArray.add(lte("patent_date", toDate));
        }

        if (assignee != null && !assignee.isBlank()) {
            andArray.add(textAny(
                    "assignees.assignee_organization", assignee));
        }

        if (inventor != null && !inventor.isBlank()) {
            andArray.add(textAny(
                    "inventors.inventor_name_last", inventor));
        }

        query.set("_and", andArray);
        root.set("q", query);

        root.putArray("f")
                .add("patent_id")
                .add("patent_title")
                .add("patent_date")
                .add("assignees.assignee_organization")
                .add("inventors.inventor_name_first")
                .add("inventors.inventor_name_last");

        root.putObject("o").put("size", 1000);

        return root.toString();
    }

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
}
