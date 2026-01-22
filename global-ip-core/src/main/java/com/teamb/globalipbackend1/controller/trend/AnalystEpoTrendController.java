package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;
import com.teamb.globalipbackend1.service.trend.EpoTrendAnalyticsService;
import com.teamb.globalipbackend1.service.user.TrackGraph;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analyst/epo/trends")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
@Slf4j
public class AnalystEpoTrendController {

    private final EpoTrendAnalyticsService epoService;

    @TrackGraph(value = "EPO_FILLINGS")
    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<EpoYearCountDto>> filings() {
        return ResponseEntity.ok(epoService.filingTrend());
    }

    @GetMapping("/countries")
    @TrackGraph(value = "EPO_COUNTRIES")
    public ResponseEntity<@NonNull List<EpoCountryTrendDto>> countries() {
        return ResponseEntity.ok(epoService.countryDistribution());
    }

    @GetMapping("/technologies")
    @TrackGraph(value = "EPO_TECHNOLOGY")
    public ResponseEntity<@NonNull List<EpoTechnologyTrendDto>> technologies() {
        return ResponseEntity.ok(epoService.topTechnologies());
    }

    @GetMapping("/assignees")
    @TrackGraph(value="EPO_ASSIGNEES")
    public ResponseEntity<@NonNull List<EpoAssigneeTrendDto>> assignees() {
        return ResponseEntity.ok(epoService.topAssignees());
    }

    @GetMapping("/families")
    @TrackGraph(value = "FAMILIES")
    public ResponseEntity<@NonNull List<EpoFamilyTrendDto>> families() {
        return ResponseEntity.ok(epoService.familySizeTrend());
    }
}
