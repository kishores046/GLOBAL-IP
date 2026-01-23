package com.teamb.globalip.patenttrendsservice.dto.unified;

public record UnifiedTechnologyTrendDto(
        String cpcSection,
        long patentsViewCount,
        long epoCount
) {}
