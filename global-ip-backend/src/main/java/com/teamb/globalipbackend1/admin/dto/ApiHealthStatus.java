package com.teamb.globalipbackend1.admin.dto;

public record ApiHealthStatus(
        String service,
        HealthState status,
        Double avgLatencyMs,
        Double errorRate
) {
    public static ApiHealthStatus healthy(String s, Double l, Double e) {
        return new ApiHealthStatus(s, HealthState.HEALTHY, l, e);
    }

    public static ApiHealthStatus warning(String s, Double l, Double e) {
        return new ApiHealthStatus(s, HealthState.WARNING, l, e);
    }

    public static ApiHealthStatus error(String s, Double l, Double e) {
        return new ApiHealthStatus(s, HealthState.ERROR, l, e);
    }

    public static ApiHealthStatus unknown(
            String service,
            double latency,
            double errorRate
    ) {
        return new ApiHealthStatus(service, HealthState.UNKNOWN, latency, errorRate);
    }
}
