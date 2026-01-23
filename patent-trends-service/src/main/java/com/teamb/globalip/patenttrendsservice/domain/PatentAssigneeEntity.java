package com.teamb.globalip.patenttrendsservice.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "patent_assignee")
@Getter
@NoArgsConstructor
public class PatentAssigneeEntity {

    @Id
    @GeneratedValue
    private Long id;

    private String patentId;
    private UUID assigneeId;
    private String organizationName;
    private Integer assigneeType;
    private UUID locationId;
}
