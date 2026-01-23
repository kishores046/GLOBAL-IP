package com.teamb.globalipbackend1.admin.dto;

import java.time.LocalDateTime;

public record UserActivityDto(
        String username,
        String email,
        long requestsLast24h,
        long requestsLast7d,
        long requestsLast30d,
        LocalDateTime lastActivity,
        String mostUsedService
) {
}