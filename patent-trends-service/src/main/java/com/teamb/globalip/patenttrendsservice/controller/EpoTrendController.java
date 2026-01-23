package com.teamb.globalip.patenttrendsservice.controller;

import com.teamb.globalip.patenttrendsservice.dto.epo.*;
import com.teamb.globalip.patenttrendsservice.service.EpoTrendService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/epo/trends")
@RequiredArgsConstructor
@Profile("prod")
public class EpoTrendController {

    private final EpoTrendService trendService;

    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<EpoYearCountDto>> filingTrend() {
        return ResponseEntity.ok(trendService.filingTrend());
    }

    @GetMapping("/countries")
    public ResponseEntity<@NonNull List<EpoCountryTrendDto>> countryDistribution() {
        return ResponseEntity.ok(trendService.countryDistribution());
    }

    @GetMapping("/technologies")
    public ResponseEntity<@NonNull List<EpoTechnologyTrendDto>> topTechnologies() {
        return ResponseEntity.ok(trendService.topTechnologies());
    }

    @GetMapping("/assignees")
    public ResponseEntity<@NonNull List<EpoAssigneeTrendDto>> topAssignees() {
        return ResponseEntity.ok(trendService.topAssignees());
    }

    @GetMapping("/families")
    public ResponseEntity<@NonNull List<EpoFamilyTrendDto>> familySizeTrend() {
        return ResponseEntity.ok(trendService.familySizeTrend());
    }
}