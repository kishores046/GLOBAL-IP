package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.unified;

public record UnifiedCountryTrendDto(
        String country,
        long patentsViewCount,
        long epoCount
) {}
