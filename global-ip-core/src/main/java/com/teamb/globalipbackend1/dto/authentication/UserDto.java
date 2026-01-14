package com.teamb.globalipbackend1.dto.authentication;

import com.teamb.globalipbackend1.model.user.Role;
import com.teamb.globalipbackend1.model.user.User;

import java.time.LocalDateTime;
import java.util.Set;

public record UserDto(
        String username,
        String email,
        Set<Role> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserDto toResponse(User user) {
        return new UserDto(
                user.getUsername(),
                user.getEmail(),
                user.getRoles(),     // ← FIXED
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
