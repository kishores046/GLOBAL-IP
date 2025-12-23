package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class PatentsViewPatent {

    @JsonProperty("patent_id")
    private String patentId;

    @JsonProperty("patent_title")
    private String patentTitle;

    @JsonProperty("patent_date")
    private LocalDate patentDate;

    @JsonProperty("patent_year")
    private int patentYear;

    @JsonProperty("patent_abstract")
    private String patentAbstract;
}
