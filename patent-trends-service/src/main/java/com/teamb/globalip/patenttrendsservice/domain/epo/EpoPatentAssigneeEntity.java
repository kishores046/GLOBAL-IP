package com.teamb.globalip.patenttrendsservice.domain.epo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(
        name = "epo_patent_assignee",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"epoPatentId", "organizationName"}
                )
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EpoPatentAssigneeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String epoPatentId;
    private String organizationName;
}

