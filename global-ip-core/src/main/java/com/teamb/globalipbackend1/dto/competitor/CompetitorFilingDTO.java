package com.teamb.globalipbackend1.dto.competitor;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorFilingDTO {

    private Long id;

    private Long competitorId;
    private String competitorCode;
    private String competitorName;

    private String patentId;
    private String title;
    private LocalDate publicationDate;
    private String jurisdiction;

    /** Analytics clarity */
    private String filedBy;       // Apple Inc
    private String currentOwner;  // Micron / Lenovo / etc.

    private String filingType;
    private String status;
    private LocalDateTime fetchedAt;
}
