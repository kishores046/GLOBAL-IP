package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewUSApplicationCitation {

    @JsonProperty("patent_id")
    private String patentId; // The citing patent

    @JsonProperty("citation_document_number")
    private String citationDocumentNumber; // Pre-grant publication number

    @JsonProperty("citation_sequence")
    private Integer citationSequence;

    @JsonProperty("citation_category")
    private String citationCategory;

    @JsonProperty("citation_date")
    private LocalDate citationDate;

    @JsonProperty("citation_name")
    private String citationName;

    @JsonProperty("citation_wipo_kind")
    private String citationWipoKind;
}