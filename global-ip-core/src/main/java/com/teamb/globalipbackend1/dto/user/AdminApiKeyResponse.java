package com.teamb.globalipbackend1.dto.user;

import com.teamb.globalipbackend1.model.user.ApiKey;
import com.teamb.globalipbackend1.model.user.ApiKeyStatus;

import java.time.LocalDateTime;

public record AdminApiKeyResponse(
        Long id,
        String userId,
        String name,
        String maskedKey,
        ApiKeyStatus status,
        LocalDateTime createdAt,
        LocalDateTime lastUsedAt
) {
    public static AdminApiKeyResponse from(ApiKey key) {
        return new AdminApiKeyResponse(
                key.getId(),
                key.getUserId(),
                key.getName(),
                key.getKeyPrefix() + "••••",
                key.getStatus(),
                key.getCreatedAt(),
                key.getLastUsedAt()
        );
    }
}
