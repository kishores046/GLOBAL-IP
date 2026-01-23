package com.teamb.globalip.patenttrendsservice.dto.unified;

public record UnifiedCountryTrendDto(
        String country,
        long patentsViewCount,
        long epoCount
) {}
