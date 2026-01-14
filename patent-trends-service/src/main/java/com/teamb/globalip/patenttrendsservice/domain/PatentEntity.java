package com.teamb.globalip.patenttrendsservice.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patent")
@Getter
@NoArgsConstructor
public class PatentEntity {

    @Id
    @Column(name = "patent_id")
    private String patentId;

    private String patentType;

    @Column(name = "grant_date")
    private LocalDate grantDate;

    private String title;

    @Column(name = "wipo_kind")
    private String wipoKind;

    @Column(name = "claim_count")
    private Integer claimCount;

    private Boolean withdrawn;

    @Column(name = "source_file")
    private String sourceFile;

    private String country;
}
