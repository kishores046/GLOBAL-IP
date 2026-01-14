package com.teamb.globalipbackend1.admin.controller;



import com.teamb.globalipbackend1.admin.dto.*;
import com.teamb.globalipbackend1.admin.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMonitoringController {

    private final AdminOverviewService overviewService;
    private final ApiHealthService healthService;
    private final ErrorSummaryService errorService;

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
}
