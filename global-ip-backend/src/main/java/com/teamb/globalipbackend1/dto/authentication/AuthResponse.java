package com.teamb.globalipbackend1.dto.authentication;

import com.teamb.globalipbackend1.model.Role;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String username,
        String email,
        Role role
) {
    public AuthResponse(String token, Long userId, String username, String email, Role role) {
        this(token, "Bearer", userId, username, email, role);
    }
}