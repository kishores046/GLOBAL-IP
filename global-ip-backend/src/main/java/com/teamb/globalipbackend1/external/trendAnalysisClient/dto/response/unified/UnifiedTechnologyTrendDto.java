package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.unified;

public record UnifiedTechnologyTrendDto(
        String cpcSection,
        long patentsViewCount,
        long epoCount
) {}
