package com.teamb.globalipbackend1.dto.competitor;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncResultDTO {
    private LocalDateTime syncStarted;
    private LocalDateTime syncCompleted;
    private Integer competitorsProcessed;
    private Integer newFilingsFound;
    private Integer duplicatesSkipped;
    private List<CompetitorSyncResult> details;
}