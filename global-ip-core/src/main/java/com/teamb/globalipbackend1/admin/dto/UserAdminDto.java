package com.teamb.globalipbackend1.admin.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record UserAdminDto(
        String id,
        String username,
        String email,
        Set<String> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}