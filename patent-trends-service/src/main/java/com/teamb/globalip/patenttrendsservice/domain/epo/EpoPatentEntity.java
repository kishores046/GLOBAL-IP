package com.teamb.globalip.patenttrendsservice.domain.epo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "epo_patent",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "epoPatentId")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EpoPatentEntity {

    @Id
    private String epoPatentId;

    private String country;
    private String kind;

    private LocalDate publicationDate;
    private LocalDate applicationDate;

    private Long familyId;
}
