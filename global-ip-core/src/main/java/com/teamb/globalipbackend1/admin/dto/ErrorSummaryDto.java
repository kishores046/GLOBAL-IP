package com.teamb.globalipbackend1.admin.dto;

public record ErrorSummaryDto(
        String service,
        long totalCalls,
        long errorCalls,
        double errorRate
) {}
