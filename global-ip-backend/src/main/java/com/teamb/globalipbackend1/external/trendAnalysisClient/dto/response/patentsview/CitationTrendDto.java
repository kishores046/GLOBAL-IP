package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.patentsview;

public record CitationTrendDto(
        String patentId,
        Long timesCited
) {}