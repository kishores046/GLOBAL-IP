package com.teamb.globalipbackend1.dto.trademark.trend;

public record CodeDistributionDto(
        String code,
        Long count,
        Double percentage
) {}