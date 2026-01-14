package com.teamb.globalipbackend1.admin.service;

import com.teamb.globalipbackend1.admin.dto.ApiHealthStatus;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiHealthService {

    private final ApiUsageLogRepository repo;

    public ApiHealthStatus health(String service) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime window15 = now.minusMinutes(15);

        LocalDateTime lastSuccess = repo.lastSuccess(service);
        Double errorRate = repo.errorRate(service, window15);
        Double latency = repo.avgLatency(service, window15);

        // Normalize nulls
        if (errorRate == null) errorRate = 0.0;
        if (latency == null) latency = 0.0;


        if (lastSuccess == null) {
            return ApiHealthStatus.unknown(service, latency, errorRate);
        }

        // No success in last 1 hour → ERROR
        if (lastSuccess.isBefore(now.minusHours(1))) {
            return ApiHealthStatus.error(service, latency, errorRate);
        }

        // Error-rate based health
        if (errorRate > 0.30) {
            return ApiHealthStatus.error(service, latency, errorRate);
        }

        if (errorRate > 0.10) {
            return ApiHealthStatus.warning(service, latency, errorRate);
        }

        return ApiHealthStatus.healthy(service, latency, errorRate);
    }
}
