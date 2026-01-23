package com.teamb.globalipbackend1.admin.dto;

public record BlockUserResponse(
        String userId,
        String email,
        boolean blocked,
        String blockReason,
        String blockedAt,
        String message
) {}