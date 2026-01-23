package com.teamb.globalipbackend1.dto.competitor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilingSummaryDTO {
    private Long totalFilings;
    private LocalDate oldestFiling;
    private LocalDate newestFiling;
    private Long competitorsTracked;
    private List<CompetitorFilingSummary> byCompetitor;
}
