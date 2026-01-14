package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.patentsview;

public record FilingTrendDto(
        Integer year,
        Long filings
) {}