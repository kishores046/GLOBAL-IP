package com.teamb.globalipbackend1.admin.service;

import com.teamb.globalipbackend1.admin.dto.ApiHealthStatus;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiHealthService {

    private final ApiUsageLogRepository repo;

    public ApiHealthStatus health(String service) {


        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime window15 = now.minusMinutes(15);

        LocalDateTime lastSuccess = repo.lastSuccess(service);
        Double errorRate = repo.errorRate(service, window15);
        Double latency = repo.avgLatency(service, window15);


        if (errorRate == null) errorRate = 0.0;
        if (latency == null) latency = 0.0;


        Double uptime = (1.0 - errorRate) * 100.0;


        String lastSync = calculateLastSync(lastSuccess, now);


        if (lastSuccess == null) {
            return ApiHealthStatus.unknown(service, latency, errorRate);
        }


        if (lastSuccess.isBefore(now.minusHours(1))) {
            return ApiHealthStatus.error(service, latency, errorRate, uptime, lastSync);
        }

       
        if (errorRate > 0.30) {
            return ApiHealthStatus.error(service, latency, errorRate, uptime, lastSync);
        }

        if (errorRate > 0.10) {
            return ApiHealthStatus.warning(service, latency, errorRate, uptime, lastSync);
        }

        return ApiHealthStatus.healthy(service, latency, errorRate, uptime, lastSync);
    }

    /**
     * Calculates human-readable time difference between last success and now
     * Examples: "Just now", "2 mins ago", "15 mins ago", "2 hours ago"
     */
    private String calculateLastSync(LocalDateTime lastSuccess, LocalDateTime now) {
        if (lastSuccess == null) {
            return "Never";
        }

        long seconds = ChronoUnit.SECONDS.between(lastSuccess, now);

        if (seconds < 60) {
            return "Just now";
        }

        long minutes = seconds / 60;
        if (minutes < 60) {
            return minutes + " min" + (minutes > 1 ? "s" : "") + " ago";
        }

        long hours = minutes / 60;
        if (hours < 24) {
            return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        }

        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}





