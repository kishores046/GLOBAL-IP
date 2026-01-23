package com.teamb.globalip.patenttrendsservice.controller;

import com.teamb.globalip.patenttrendsservice.dto.*;
import com.teamb.globalip.patenttrendsservice.service.TrendService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
@RequiredArgsConstructor
@Profile("prod")
public class TrendController {

    private final TrendService trendService;

    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<FilingTrendDto>> filingTrend() {
        return ResponseEntity.ok(trendService.filingTrend());
    }

    @GetMapping("/grants")
    public ResponseEntity<@NonNull List<GrantTrendDto>> grantTrend() {
        return ResponseEntity.ok(trendService.grantTrend());
    }


    @GetMapping("/countries")
    public ResponseEntity<@NonNull List<GeographicTrendDto>> topCountries(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(trendService.topCountries(limit));
    }


    @GetMapping("/technologies/top")
    public ResponseEntity<@NonNull List<TechnologyTrendDto>> topTechnologies(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(trendService.topTechnologies(limit));
    }

    @GetMapping("/technologies/evolution")
    public ResponseEntity<@NonNull List<TechnologyEvolutionDto>> technologyEvolution() {
        return ResponseEntity.ok(trendService.technologyEvolution());
    }

    @GetMapping("/technologies/crossovers")
    public ResponseEntity<@NonNull List<TechnologyCrossoverDto>> technologyCrossovers(
            @RequestParam(defaultValue = "5") int minCount,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(
                trendService.technologyCrossovers(minCount, limit)
        );
    }


    @GetMapping("/assignees/top")
    public ResponseEntity<@NonNull List<AssigneeTrendDto>> topAssignees(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(trendService.topAssignees(limit));
    }

    @GetMapping("/assignees/activity")
    public ResponseEntity<@NonNull List<AssigneeActivityDto>> assigneeActivityOverTime(
            @RequestParam(defaultValue = "5") int minPatents
    ) {
        return ResponseEntity.ok(
                trendService.assigneeActivityOverTime(minPatents)
        );
    }

    @GetMapping("/assignees/technology-focus")
    public ResponseEntity<@NonNull List<AssigneeTechnologyFocusDto>> assigneeTechnologyFocus(
            @RequestParam String assigneeName,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(
                trendService.assigneeTechnologyFocus(assigneeName, limit)
        );
    }

    @GetMapping("/assignees/innovation-velocity")
    public ResponseEntity<@NonNull Map<String, List<AssigneeActivityDto>>> innovationVelocity(
            @RequestParam List<String> assignees,
            @RequestParam int yearStart,
            @RequestParam int yearEnd
    ) {
        return ResponseEntity.ok(
                trendService.innovationVelocity(assignees, yearStart, yearEnd)
        );
    }

    @GetMapping("/citations/top-cited")
    public ResponseEntity<@NonNull List<CitationTrendDto>> topCitedPatents(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(trendService.topCitedPatents(limit));
    }

    @GetMapping("/citations/top-citing")
    public ResponseEntity<@NonNull List<CitationMetricDto>> topCitingPatents(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(trendService.topCitingPatents(limit));
    }

    @GetMapping("/citations/lag")
    public ResponseEntity<@NonNull List<CitationLagDto>> citationLagTrend() {
        return ResponseEntity.ok(trendService.citationLagTrend());
    }


    @GetMapping("/patents/type-distribution")
    public ResponseEntity<@NonNull List<PatentTypeDto>> patentTypeDistribution() {
        return ResponseEntity.ok(trendService.patentTypeDistribution());
    }

    @GetMapping("/patents/claim-complexity")
    public ResponseEntity<@NonNull List<ClaimComplexityDto>> claimComplexityTrend() {
        return ResponseEntity.ok(trendService.claimComplexityTrend());
    }

    @GetMapping("/patents/time-to-grant")
    public ResponseEntity<@NonNull List<TimeToGrantDto>> timeToGrantTrend() {
        return ResponseEntity.ok(trendService.timeToGrantTrend());
    }



    @GetMapping("/summary/{year}")
    public ResponseEntity<@NonNull YearSummaryDto> yearSummary(
            @PathVariable int year
    ) {
        return ResponseEntity.ok(trendService.getYearSummary(year));
    }
}
