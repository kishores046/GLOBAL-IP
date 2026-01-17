package com.teamb.globalipbackend1.dto.authentication;

public record LoginResponse(
        boolean passwordChangeRequired,
        String token
) {}
