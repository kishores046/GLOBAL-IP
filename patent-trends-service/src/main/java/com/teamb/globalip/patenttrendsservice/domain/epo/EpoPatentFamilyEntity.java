package com.teamb.globalip.patenttrendsservice.domain.epo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "epo_patent_family")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EpoPatentFamilyEntity {

    @Id
    private Long familyId;

    private Integer familySize;   // number of countries
}
