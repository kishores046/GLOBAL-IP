package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;
import com.teamb.globalipbackend1.model.trend.AnalyticsReport;
import com.teamb.globalipbackend1.service.trend.PatentAnalyticsService;
import com.teamb.globalipbackend1.service.user.TrackGraph;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(
        name = "US Patent Trends",
        description = "Advanced USPTO patent analytics, trends, dashboards, and reports"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
public class AnalystTrendController {

    private final PatentAnalyticsService analyticsService;


    @Operation(
            summary = "US filing trends",
            description = "Returns year-wise USPTO filing trends.",
            responses = @ApiResponse(responseCode = "200", description = "Filing trends returned successfully")
    )
    @GetMapping("/filings")
    @TrackGraph(value = "US_FILLING")
    public ResponseEntity<@NonNull List<FilingTrendDto>> filingTrend() {
        log.info("[TREND] Filing trend request received");
        var result = analyticsService.getFilingTrends();
        log.info("[TREND] Filing trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "US grant trends",
            description = "Returns year-wise USPTO grant trends.",
            responses = @ApiResponse(responseCode = "200", description = "Grant trends returned successfully")
    )

    @GetMapping("/grants")
    @TrackGraph(value = "US_GRANT_TREND")
    public ResponseEntity<@NonNull List<GrantTrendDto>> grantTrend() {
        log.info("[TREND] Grant trend request received");
        var result = analyticsService.getGrantTrends();
        log.info("[TREND] Grant trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Top technologies",
            description = "Returns top technology domains by filing count.",
            responses = @ApiResponse(responseCode = "200", description = "Top technologies returned")
    )

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

    @Operation(
            summary = "Top assignees",
            description = "Returns assignees with the highest USPTO filings.",
            responses = @ApiResponse(responseCode = "200", description = "Top assignees returned")
    )
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



    @Operation(
            summary = "Top countries",
            description = "Returns country-wise filing distribution starting from a given date.",
            responses = @ApiResponse(responseCode = "200", description = "Country distribution returned")
    )
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


    @Operation(
            summary = "Top cited patents",
            description = "Returns patents with the highest forward citation counts.",
            responses = @ApiResponse(responseCode = "200", description = "Top cited patents returned")
    )
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

    @Operation(
            summary = "Top citing patents",
            description = "Returns patents that cite the most prior art.",
            responses = @ApiResponse(responseCode = "200", description = "Top citing patents returned")
    )
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


    @Operation(
            summary = "Patent type distribution",
            description = "Returns distribution of patent types (utility, design, plant).",
            responses = @ApiResponse(responseCode = "200", description = "Patent type distribution returned")
    )
    @GetMapping("/patents/type-distribution")
    @TrackGraph(value = "PATENT_TYPE_DISTRIBUTION_US")
    public ResponseEntity<@NonNull
            List<PatentTypeDto>> patentTypeDistribution() {
        log.info("[TREND] Patent type distribution request received");
        List<PatentTypeDto> result = analyticsService.getPatentTypeDistribution();
        log.info("[TREND] Patent type distribution result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Claim complexity trends",
            description = "Returns trends based on patent claim complexity.",
            responses = @ApiResponse(responseCode = "200", description = "Claim complexity trends returned")
    )
    @GetMapping("/patents/claim-complexity")
    @TrackGraph("CLAIM_COMPLEXITY_US")
    public ResponseEntity<@NonNull List<ClaimComplexityDto>> claimComplexityTrend() {
        log.info("[TREND] Claim complexity trend request received");
        List<ClaimComplexityDto> result = analyticsService.getClaimComplexityTrend();
        log.info("[TREND] Claim complexity trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }


    @Operation(
            summary = "Time to grant trends",
            description = "Returns trends of time taken from filing to grant.",
            responses = @ApiResponse(responseCode = "200", description = "Time-to-grant trends returned")
    )
    @GetMapping("/patents/time-to-grant")
    @TrackGraph(value = "TIME_TO_GRAND_US")
    public ResponseEntity<@NonNull List<TimeToGrantDto>> timeToGrantTrend() {
        log.info("[TREND] Time-to-grant trend request received");
        List<TimeToGrantDto> result = analyticsService.getTimeToGrantTrend();
        log.info("[TREND] Time-to-grant trend result size={}", result.size());
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Comprehensive dashboard",
            description = "Returns a consolidated analytics dashboard for a given year.",
            responses = @ApiResponse(responseCode = "200", description = "Dashboard data returned")
    )

    @GetMapping("/dashboard/{year}")
    public ResponseEntity<@NonNull Map<String, Object>> dashboard(
            @PathVariable
            @Min(1900) @Max(2100) int year) {

        log.info("[DASHBOARD] Comprehensive dashboard request year={}", year);
        Map<String, Object> result = analyticsService.getComprehensiveDashboard(year);
        log.info("[DASHBOARD] Dashboard response keys={}", result.keySet());
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Generate analytics report",
            description = "Generates and stores a yearly analytics report.",
            responses = @ApiResponse(responseCode = "200", description = "Report generated successfully")
    )

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

    @Operation(
            summary = "List analytics reports",
            description = "Returns all generated analytics reports.",
            responses = @ApiResponse(responseCode = "200", description = "Reports returned successfully")
    )
    @GetMapping("/reports")
    public ResponseEntity<@NonNull List<AnalyticsReport>> getAllReports() {
        log.info("[REPORT] Fetch all analytics reports request received");
        List<AnalyticsReport> reports = analyticsService.getAllReports();
        log.info("[REPORT] Total reports fetched={}", reports.size());
        return ResponseEntity.ok(reports);
    }

    @Operation(
            summary = "Technology evolution trends",
            description = "Returns how technology domains evolve over time.",
            responses = @ApiResponse(responseCode = "200", description = "Technology evolution returned")
    )
    @GetMapping("/technologies/evolution")
    @TrackGraph(value = "TECHNOLOGY_EVOLVE_US")
    public ResponseEntity<@NonNull List<TechnologyEvolutionDto>> technologyEvolution() {
        log.info("[TREND] Technology evolution request received");
        List<TechnologyEvolutionDto> result = analyticsService.getTechnologyEvolution();
        log.info("[TREND] Technology evolution result size={}", result.size());
        return ResponseEntity.ok(result);
    }


}
