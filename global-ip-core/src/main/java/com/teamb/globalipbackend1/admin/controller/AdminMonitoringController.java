package com.teamb.globalipbackend1.admin.controller;



import com.teamb.globalipbackend1.admin.dto.*;
import com.teamb.globalipbackend1.admin.service.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMonitoringController {

    private final AdminOverviewService overviewService;
    private final ApiHealthService healthService;
    private final ErrorSummaryService errorService;
    private final UsageLogService usageLogService;

    @GetMapping("/overview")
    public AdminOverviewDto overview() {
        return overviewService.overview();
    }

    @GetMapping("/health")
    public List<ApiHealthStatus> health() {
        return List.of(
                healthService.health("EPO"),
                healthService.health("USPTO"),
                healthService.health("TRADEMARK"),
                healthService.health("TRENDS")
        );
    }

    @GetMapping("/errors")
    public List<ErrorSummaryDto> errors() {
        return errorService.summary();
    }



    @GetMapping("/usage-logs")
    public Page<@NonNull ApiUsageLogDto> getUsageLogs(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp,desc") String sort
    ) {
        return usageLogService.getFilteredLogs(
                service, status, action, startDate, endDate,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"))
        );
    }

    @GetMapping("/usage-logs/export")
    public ResponseEntity<byte[]> exportLogs(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate
    ) {
        byte[] csv = usageLogService.exportToCsv(service, status, startDate, endDate);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=api-logs.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }


    @GetMapping("/health/summary")
    public SystemHealthSummary getHealthSummary() {
        List<ApiHealthStatus> allHealth = health();


        long operational = allHealth.stream()
                .filter(h -> h.status() == HealthState.HEALTHY)
                .count();


        double avgLatency = allHealth.stream()
                .mapToDouble(h -> h.avgLatencyMs() != null ? h.avgLatencyMs() : 0.0)
                .average()
                .orElse(0.0);


        long totalRequests = overviewService.overview().requestsToday();


        String overallHealth;
        double healthPercentage = (double) operational / allHealth.size();

        if (healthPercentage >= 0.8) {
            overallHealth = "Good";
        } else if (healthPercentage >= 0.5) {
            overallHealth = "Degraded";
        } else {
            overallHealth = "Critical";
        }

        String operationalStatus = operational + " out of " + allHealth.size() + " APIs operational";

        return new SystemHealthSummary(
                operationalStatus,
                Math.round(avgLatency * 100.0) / 100.0, // Round to 2 decimal places
                totalRequests,
                overallHealth
        );
    }
}
