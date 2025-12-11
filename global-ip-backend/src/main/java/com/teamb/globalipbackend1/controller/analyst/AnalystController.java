package com.teamb.globalipbackend1.controller.analyst;

import com.teamb.globalipbackend1.dto.analyst.AnalystSearchResponse;
import com.teamb.globalipbackend1.dto.analyst.BasicStatisticsResponse;
import com.teamb.globalipbackend1.dto.analyst.TrendStatsResponse;
import com.teamb.globalipbackend1.service.analyst.AnalystService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst")
@RequiredArgsConstructor

public class AnalystController {



    private final AnalystService analystService;

    @GetMapping("/search")
    @PreAuthorize("hasRole('ANALYST')")
    public AnalystSearchResponse search(@RequestParam String query) {
        return analystService.mockSearch(query);
    }

    @GetMapping("/stats/basic")
    @PreAuthorize("hasRole('ANALYST')")
    public BasicStatisticsResponse basicStats() {
        return analystService.mockBasicStats();
    }

    @GetMapping("/stats/trends")
    @PreAuthorize("hasRole('ANALYST')")
    public TrendStatsResponse trendStats() {
        return analystService.mockTrendStats();
    }
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<?> getAnalystDashboard() {
        return ResponseEntity.ok("Analyst Dashboard Data");
    }
}