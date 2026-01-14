package com.teamb.globalipbackend1.dto.user;

public record UpdateProfileRequest(
        String username,
        String phoneNumber,
        String location,
        String company,
        String position,
        String bio
) {}
