package com.teamb.globalip.patenttrendsservice.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "patent_citation")
@Getter
@NoArgsConstructor
public class PatentCitationEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String patentId;
    private String citedPatentId;
    private LocalDate citationDate;
    private String citationCategory;
}

