package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.request.InnovationVelocityRequest;
import com.teamb.globalipbackend1.external.trendsApi.dto.request.TechnologyCrossoverRequest;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.AssigneeActivityDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.TechnologyCrossoverDto;
import com.teamb.globalipbackend1.service.trend.PatentAnalyticsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/trend")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTrendController {
    private final PatentAnalyticsService analyticsService;



    @PostMapping("/innovation-velocity")
    public ResponseEntity<@NonNull Map<String, List<AssigneeActivityDto>>> getInnovationVelocity(
            @Valid @RequestBody InnovationVelocityRequest request) {
        return ResponseEntity.ok(
                analyticsService.getInnovationVelocityForAssignees(request.assignees(), request.yearStart(), request.yearEnd()));
    }

    @PostMapping("/technology-crossovers")
    public ResponseEntity<@NonNull List<TechnologyCrossoverDto>> getTechnologyCrossovers(
            @Valid @RequestBody TechnologyCrossoverRequest request) {
        return ResponseEntity.ok(
                analyticsService.analyzeTechnologyCrossovers(request));
    }


    @PostMapping("/reports/schedule")
    public ResponseEntity<@NonNull String> scheduleReportGeneration(
            @RequestParam String cronExpression) {
        analyticsService.scheduleReportGeneration(cronExpression);
        return ResponseEntity.ok("Report generation scheduled: " + cronExpression);
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<@NonNull Void> deleteReport(@PathVariable Long id) {
        // Implement deletion logic
        return ResponseEntity.noContent().build();
    }
}