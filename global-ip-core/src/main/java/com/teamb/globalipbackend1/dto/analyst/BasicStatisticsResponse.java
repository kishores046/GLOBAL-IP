package com.teamb.globalipbackend1.dto.analyst;

public record BasicStatisticsResponse(
        int totalAssets,
        int activeAssets,
        int expiredAssets
) {}