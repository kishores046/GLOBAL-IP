package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.patentsview;

public record AssigneeTrendDto(
        String assignee,
        Long patentCount
) {}