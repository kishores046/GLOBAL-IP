package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewUSPatentCitation {

    @JsonProperty("patent_id")
    private String patentId; // The citing patent

    @JsonProperty("citation_patent_id")
    private String citationPatentId; // The cited patent

    @JsonProperty("citation_sequence")
    private Integer citationSequence;

    @JsonProperty("citation_category")
    private String citationCategory; // "cited by examiner", "cited by applicant"

    @JsonProperty("citation_date")
    private LocalDate citationDate;

    // Deprecated: for backward compatibility with old PatentCitationService
    @Deprecated
    public String getCitationId() {
        return citationPatentId;
    }

    @Deprecated
    public void setCitationId(String citationId) {
        this.citationPatentId = citationId;
    }
}