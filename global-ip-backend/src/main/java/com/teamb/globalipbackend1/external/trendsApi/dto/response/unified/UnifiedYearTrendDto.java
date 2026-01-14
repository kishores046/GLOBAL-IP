package com.teamb.globalipbackend1.external.trendsApi.dto.response.unified;

public record UnifiedYearTrendDto(
        int year,
        long patentsViewCount,
        long epoCount
) {}
