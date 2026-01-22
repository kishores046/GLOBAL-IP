package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;
import com.teamb.globalipbackend1.model.trend.AnalyticsReport;
import com.teamb.globalipbackend1.service.trend.PatentAnalyticsService;
import com.teamb.globalipbackend1.service.user.TrackGraph;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/analyst/trend")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
public class AnalystTrendController {

    private final PatentAnalyticsService analyticsService;


    @GetMapping("/filings")
    @TrackGraph(value = "US_FILLING")
    public ResponseEntity<@NonNull List<FilingTrendDto>> filingTrend() {
        log.info("[TREND] Filing trend request received");
        var result = analyticsService.getFilingTrends();
        log.info("[TREND] Filing trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/grants")
    @TrackGraph(value = "US_GRANT_TREND")
    public ResponseEntity<@NonNull List<GrantTrendDto>> grantTrend() {
        log.info("[TREND] Grant trend request received");
        var result = analyticsService.getGrantTrends();
        log.info("[TREND] Grant trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }


    @GetMapping("/technologies/top")
    @TrackGraph("US_TOP_TECHNOLOGY")
    public ResponseEntity<@NonNull List<TechnologyTrendDto>> topTechnologies(
            @RequestParam(defaultValue = "10")
            @Min(1) @Max(100) int limit) {
        log.info("[TREND] Top technologies request limit={}", limit);
        var result = analyticsService.getTopTechnologies(limit);
        log.info("[TREND] Top technologies result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/assignees/top")
    @TrackGraph("US_TOP_ASSIGNEES")
    public ResponseEntity<@NonNull List<AssigneeTrendDto>> topAssignees(
            @RequestParam(defaultValue = "10")
            @Min(1) @Max(100) int limit) {
        log.info("[TREND] Top assignees request limit={}", limit);
        var result = analyticsService.getTopAssignees(limit);
        log.info("[TREND] Top assignees result size={}", result.size());
        return ResponseEntity.ok(result);
    }



    @GetMapping("/countries")
    @TrackGraph("US_TOP_COUNTRIES")
    public ResponseEntity<@NonNull List<GeographicTrendDto>> topCountries(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam(defaultValue = "10")
            @Min(1) @Max(100) int limit) {

        log.info("[TREND] Country distribution request startDate={}, limit={}", startDate, limit);
        var result = analyticsService.getTopCountries(startDate, limit);
        log.info("[TREND] Country distribution result size={}", result.size());
        return ResponseEntity.ok(result);
    }


    @GetMapping("/citations/top-cited")
    @TrackGraph("TOP_CITED_US")
    public ResponseEntity<@NonNull List<CitationTrendDto>> topCitedPatents(
            @RequestParam(defaultValue = "10")
            @Min(1) @Max(100) int limit) {
        log.info("[TREND] Top cited patents request limit={}", limit);
        var result = analyticsService.getTopCitedPatents(limit);
        log.info("[TREND] Top cited patents result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/citations/top-citing")
    @TrackGraph("TOP_CITING_US")
    public ResponseEntity<@NonNull List<CitationMetricDto>> topCitingPatents(
            @RequestParam(defaultValue = "10")
            @Min(1) @Max(100) int limit) {

        log.info("[TREND] Top citing patents request limit={}", limit);
        var result = analyticsService.getTopCitingPatents(limit);
        log.info("[TREND] Top citing patents result size={}", result.size());
        log.info(result.toString());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/patents/type-distribution")
    @TrackGraph(value = "PATENT_TYPE_DISTRIBUTION_US")
    public ResponseEntity<@NonNull
            List<PatentTypeDto>> patentTypeDistribution() {
        log.info("[TREND] Patent type distribution request received");
        List<PatentTypeDto> result = analyticsService.getPatentTypeDistribution();
        log.info("[TREND] Patent type distribution result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/patents/claim-complexity")
    @TrackGraph("CLAIM_COMPLEXITY_US")
    public ResponseEntity<@NonNull List<ClaimComplexityDto>> claimComplexityTrend() {
        log.info("[TREND] Claim complexity trend request received");
        List<ClaimComplexityDto> result = analyticsService.getClaimComplexityTrend();
        log.info("[TREND] Claim complexity trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/patents/time-to-grant")
    @TrackGraph(value = "TIME_TO_GRAND_US")
    public ResponseEntity<@NonNull List<TimeToGrantDto>> timeToGrantTrend() {
        log.info("[TREND] Time-to-grant trend request received");
        List<TimeToGrantDto> result = analyticsService.getTimeToGrantTrend();
        log.info("[TREND] Time-to-grant trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/dashboard/{year}")
    public ResponseEntity<@NonNull Map<String, Object>> dashboard(
            @PathVariable
            @Min(1900) @Max(2100) int year) {

        log.info("[DASHBOARD] Comprehensive dashboard request year={}", year);
        Map<String, Object> result = analyticsService.getComprehensiveDashboard(year);
        log.info("[DASHBOARD] Dashboard response keys={}", result.keySet());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reports/generate")
    public ResponseEntity<@NonNull AnalyticsReport> generateReport(
            @RequestParam String reportName,
            @RequestParam
            @Min(1900) @Max(2100) int year) {

        log.info("[REPORT] Generate report request name='{}', year={}", reportName, year);
        AnalyticsReport report = analyticsService.generateAndSaveReport(reportName, year);
        log.info("[REPORT] Report generated id={}, name='{}'",
                report.getId(), report.getReportName());
        return ResponseEntity.ok(report);
    }

    @GetMapping("/reports")
    public ResponseEntity<@NonNull List<AnalyticsReport>> getAllReports() {
        log.info("[REPORT] Fetch all analytics reports request received");
        List<AnalyticsReport> reports = analyticsService.getAllReports();
        log.info("[REPORT] Total reports fetched={}", reports.size());
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/technologies/evolution")
    @TrackGraph(value = "TECHNOLOGY_EVOLVE_US")
    public ResponseEntity<@NonNull List<TechnologyEvolutionDto>> technologyEvolution() {
        log.info("[TREND] Technology evolution request received");
        List<TechnologyEvolutionDto> result = analyticsService.getTechnologyEvolution();
        log.info("[TREND] Technology evolution result size={}", result.size());
        return ResponseEntity.ok(result);
    }


}
