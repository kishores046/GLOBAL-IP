package com.teamb.globalipbackend1.external.trendsApi.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record InnovationVelocityRequest(
        @NotEmpty List<String> assignees,
        @Min(1900) Integer yearStart,
        @Min(1900) Integer yearEnd
) {}