package com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview;

public record AssigneeTrendDto(
        String assignee,
        Long patentCount
) {}