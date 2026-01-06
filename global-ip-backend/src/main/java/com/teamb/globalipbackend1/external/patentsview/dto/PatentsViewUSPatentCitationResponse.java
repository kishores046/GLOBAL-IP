package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewUSPatentCitationResponse {

    @JsonProperty("us_patent_citations")
    private List<PatentsViewUSPatentCitation> usPatentCitations;

    @JsonProperty("count")
    private Integer count;

    @JsonProperty("total_patent_count")
    private Integer totalPatentCount;
}