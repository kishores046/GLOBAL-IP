package com.teamb.globalipbackend1.dto.competitor;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorFilingSummary {
    private String competitorCode;
    private String competitorName;
    private Long filingCount;
    private LocalDate latestFiling;
}
