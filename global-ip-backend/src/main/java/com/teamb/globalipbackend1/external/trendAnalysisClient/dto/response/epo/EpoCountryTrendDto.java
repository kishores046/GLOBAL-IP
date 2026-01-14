package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.epo;

public record EpoCountryTrendDto(
        String country,
        long patentCount
) {}
