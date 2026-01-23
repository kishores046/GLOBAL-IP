package com.teamb.globalipbackend1.dto.user;

import com.teamb.globalipbackend1.model.user.ApiKey;
import com.teamb.globalipbackend1.model.user.ApiKeyStatus;

import java.time.LocalDateTime;

public record ApiKeyResponse(
        Long id,
        String name,
        String maskedKey,
        ApiKeyStatus status,
        LocalDateTime createdAt,
        LocalDateTime lastUsedAt
) {
    public static ApiKeyResponse from(ApiKey key) {
        return new ApiKeyResponse(
                key.getId(),
                key.getName(),
                key.getKeyPrefix() + "••••",
                key.getStatus(),
                key.getCreatedAt(),
                key.getLastUsedAt()
        );
    }
}
