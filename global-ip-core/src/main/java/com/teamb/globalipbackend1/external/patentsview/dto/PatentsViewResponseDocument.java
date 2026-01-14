package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewResponseDocument {

    @JsonProperty("patent_id")
    private String patentId;

    @JsonProperty("patent_title")
    private String patentTitle;

    @JsonProperty("patent_date")
    private LocalDate patentDate;

    @JsonProperty("patent_year")
    private Integer patentYear;

    @JsonProperty("patent_abstract")
    private String patentAbstract;

    @JsonProperty("assignees")
    private List<PatentsViewAssignee> patentsViewAssignees;

    @JsonProperty("cpc_current")
    private List<PatentsViewCpcCurrent> patentsViewCpcCurrents;

    @JsonProperty("inventors")
    private List<PatentsViewInventor> patentsViewInventors;

    @JsonProperty("wipo")
    private List<PatentsViewWipo> patentsViewWipos;

    @JsonProperty("ipc_current")
    private List<PatentsViewIpcClass> patentsViewIpcCurrent;



    @JsonProperty("patent_earliest_application_date")
    private LocalDate patentEarliestApplicationDate;

    @JsonProperty("wipo_kind")
    private String wipoKind;

    @JsonProperty("patent_num_times_cited_by_us_patents")
    private Integer patentNumTimesCitedByUsPatents;

    @JsonProperty("patent_num_total_documents_cited")
    private Integer patentNumTotalDocumentsCited;

}
