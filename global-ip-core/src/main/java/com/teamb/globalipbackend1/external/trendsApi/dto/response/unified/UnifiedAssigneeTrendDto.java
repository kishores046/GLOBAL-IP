package com.teamb.globalipbackend1.external.trendsApi.dto.response.unified;

public record UnifiedAssigneeTrendDto(
        String assignee,
        long patentsViewCount,
        long epoCount
) {}
