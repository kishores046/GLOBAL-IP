package com.teamb.globalipbackend1.admin.dto;

public record SystemHealthSummary(
        String operationalStatus,  // e.g., "4 out of 5 APIs operational"
        Double avgLatency,          // Average latency across all services
        Long totalRequests,         // Total requests in last 24 hours
        String overallHealth        // "Good", "Degraded", "Critical"
) {
}




