package com.teamb.globalipbackend1.external.trendsApi.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record AssigneeAnalysisRequest(
        @NotBlank String assigneeName,
        @Min(1) @Max(100) Integer limit,
        @Min(1900) Integer yearStart,
        @Min(1900) Integer yearEnd
) {
    public AssigneeAnalysisRequest {
        if (limit == null) limit = 10;
        if (yearStart == null) yearStart = LocalDate.now().getYear() - 10;
        if (yearEnd == null) yearEnd = LocalDate.now().getYear();
    }
}