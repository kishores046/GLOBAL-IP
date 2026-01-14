package com.teamb.globalip.patenttrendsservice.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patent_cpc")
@Getter
@NoArgsConstructor
public class PatentCpcEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String patentId;
    private String cpcSection;
    private String cpcClass;
    private String cpcSubclass;
    private String cpcGroup;
    private String cpcType;
}
