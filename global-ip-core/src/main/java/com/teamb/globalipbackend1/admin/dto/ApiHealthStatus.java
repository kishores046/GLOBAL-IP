package com.teamb.globalipbackend1.admin.dto;

public record ApiHealthStatus(
        String service,
        HealthState status,
        Double avgLatencyMs,
        Double errorRate,
        Double uptime,      // New: Uptime percentage (0-100)
        String lastSync     // New: Human-readable last sync time
) {

    // Constructor with uptime and lastSync
    public static ApiHealthStatus healthy(String service, Double latency, Double errorRate, Double uptime, String lastSync) {
        return new ApiHealthStatus(service, HealthState.HEALTHY, latency, errorRate, uptime, lastSync);
    }

    public static ApiHealthStatus warning(String service, Double latency, Double errorRate, Double uptime, String lastSync) {
        return new ApiHealthStatus(service, HealthState.WARNING, latency, errorRate, uptime, lastSync);
    }

    public static ApiHealthStatus error(String service, Double latency, Double errorRate, Double uptime, String lastSync) {
        return new ApiHealthStatus(service, HealthState.ERROR, latency, errorRate, uptime, lastSync);
    }

    public static ApiHealthStatus unknown(String service, Double latency, Double errorRate) {
        return new ApiHealthStatus(service, HealthState.UNKNOWN, latency, errorRate, 0.0, "Never");
    }

    // Backward compatibility methods (deprecated - use versions with uptime and lastSync)
    @Deprecated
    public static ApiHealthStatus healthy(String service, Double latency, Double errorRate) {
        return healthy(service, latency, errorRate, calculateUptime(errorRate), "Unknown");
    }

    @Deprecated
    public static ApiHealthStatus warning(String service, Double latency, Double errorRate) {
        return warning(service, latency, errorRate, calculateUptime(errorRate), "Unknown");
    }

    @Deprecated
    public static ApiHealthStatus error(String service, Double latency, Double errorRate) {
        return error(service, latency, errorRate, calculateUptime(errorRate), "Unknown");
    }

    // Helper method to calculate uptime from error rate
    private static Double calculateUptime(Double errorRate) {
        if (errorRate == null) return 100.0;
        return Math.max(0.0, (1.0 - errorRate) * 100.0);
    }
}