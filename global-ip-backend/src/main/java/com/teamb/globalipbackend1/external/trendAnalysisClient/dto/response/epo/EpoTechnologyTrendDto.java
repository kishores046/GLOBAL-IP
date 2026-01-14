package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.epo;

public record EpoTechnologyTrendDto(
        String cpcSection,
        long patentCount
) {}