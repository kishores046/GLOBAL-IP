package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewUSApplicationCitation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewUSApplicationCitationResponse {

    @JsonProperty("us_application_citations")
    private List<PatentsViewUSApplicationCitation> usApplicationCitations;

    @JsonProperty("count")
    private Integer count;

    @JsonProperty("total_patent_count")
    private Integer totalPatentCount;
}
