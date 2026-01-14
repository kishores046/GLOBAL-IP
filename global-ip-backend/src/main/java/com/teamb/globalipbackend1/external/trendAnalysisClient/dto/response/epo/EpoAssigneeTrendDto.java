package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.epo;

public record EpoAssigneeTrendDto(
        String organization,
        long patentCount
) {}