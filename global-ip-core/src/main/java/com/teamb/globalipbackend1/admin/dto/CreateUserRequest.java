package com.teamb.globalipbackend1.admin.dto;

import java.util.Set;

public record CreateUserRequest(
        String username,
        String email,
        String temporaryPassword,  // Admin enters this
        Set<String> roles,
        String phoneNumber,
        String company,
        String location,
        String position
) {}