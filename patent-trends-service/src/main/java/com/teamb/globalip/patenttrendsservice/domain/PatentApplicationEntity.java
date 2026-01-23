package com.teamb.globalip.patenttrendsservice.domain;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patent_application")
@Getter
@NoArgsConstructor
public class PatentApplicationEntity {

    @Id
    @Column(name = "application_id")
    private String applicationId;

    @Column(name = "patent_id")
    private String patentId;

    @Column(name = "patent_application_type")
    private String applicationType;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "series_code")
    private String seriesCode;

    @Column(name = "rule_47_flag")
    private Boolean rule47Flag;
}
