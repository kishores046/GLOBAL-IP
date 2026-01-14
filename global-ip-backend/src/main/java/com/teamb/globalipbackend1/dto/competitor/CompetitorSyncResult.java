package com.teamb.globalipbackend1.dto.competitor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorSyncResult {
    private String competitorCode;
    private Integer newFilings;
    private Integer duplicates;
    private String status;
    private String errorMessage;
}
