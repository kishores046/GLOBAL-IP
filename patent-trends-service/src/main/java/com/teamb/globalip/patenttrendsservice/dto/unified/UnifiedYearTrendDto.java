package com.teamb.globalip.patenttrendsservice.dto.unified;

public record UnifiedYearTrendDto(
        int year,
        long patentsViewCount,
        long epoCount
) {}
