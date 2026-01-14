package com.teamb.globalip.patenttrendsservice.domain.epo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "epo_patent_cpc")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EpoPatentCpcEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String epoPatentId;
    private String cpcSection;
    private String cpcClass;
}
