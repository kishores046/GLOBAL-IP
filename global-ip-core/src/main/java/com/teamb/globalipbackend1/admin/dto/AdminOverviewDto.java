package com.teamb.globalipbackend1.admin.dto;

public record AdminOverviewDto(
        long totalUsers,
        long activeUsers,
        long requestsToday,
        long errorsToday,
        String topService,
        String topAction
) {}
