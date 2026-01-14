package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewForeignCitation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewForeignCitationResponse {

    @JsonProperty("foreign_citations")
    private List<PatentsViewForeignCitation> foreignCitations;

    @JsonProperty("count")
    private Integer count;

    @JsonProperty("total_patent_count")
    private Integer totalPatentCount;

    @JsonProperty("error")
    private Boolean error;
}