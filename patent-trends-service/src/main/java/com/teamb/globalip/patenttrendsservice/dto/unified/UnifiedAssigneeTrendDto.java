package com.teamb.globalip.patenttrendsservice.dto.unified;

public record UnifiedAssigneeTrendDto(
        String assignee,
        long patentsViewCount,
        long epoCount
) {}
