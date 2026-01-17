package com.teamb.globalipbackend1.dto.authentication;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @Nonnull
        @NotBlank
        String email,
        String oldPassword,
        String newPassword
) {}

