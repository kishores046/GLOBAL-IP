package com.teamb.globalipbackend1.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record BlockUserRequest(
        @NotBlank(message = "Block reason is required")
        String reason
) {}