package com.teamb.globalipbackend1.dto.user;

import java.util.Set;

public record UserProfileResponse(
        String username,
        String email,
        Set<String> roles,
        String phoneNumber,    // ADD
        String company,        // ADD
        String location,       // ADD
        String position,       // ADD
        String bio
        ) {}
