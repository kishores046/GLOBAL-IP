package com.teamb.globalipbackend1.external.trendsApi.dto.request;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record TechnologyCrossoverRequest(
        @Min(1) Integer minCount,
        @Min(1) @Max(100) Integer limit
) {
    public TechnologyCrossoverRequest {
        if (minCount == null) minCount = 5;
        if (limit == null) limit = 20;
    }
}