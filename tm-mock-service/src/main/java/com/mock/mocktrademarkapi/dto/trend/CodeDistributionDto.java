package com.mock.mocktrademarkapi.dto.trend;

public record CodeDistributionDto(
        String code,
        Long count,
        Double percentage
) {}