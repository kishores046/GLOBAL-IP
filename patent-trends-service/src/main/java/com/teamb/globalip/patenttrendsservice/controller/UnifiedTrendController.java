package com.teamb.globalip.patenttrendsservice.controller;

import com.teamb.globalip.patenttrendsservice.dto.unified.UnifiedCountryTrendDto;
import com.teamb.globalip.patenttrendsservice.dto.unified.UnifiedYearTrendDto;
import com.teamb.globalip.patenttrendsservice.service.UnifiedTrendService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/unified/trends")
@RequiredArgsConstructor
@Profile("prod")
public class UnifiedTrendController {

    private final UnifiedTrendService unifiedTrendService;

    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<UnifiedYearTrendDto>> filingTrend() {
        return ResponseEntity.ok(unifiedTrendService.unifiedFilingTrend());
    }

    @GetMapping("/countries")
    public ResponseEntity<@NonNull List<UnifiedCountryTrendDto>> countryTrend() {
        return ResponseEntity.ok(unifiedTrendService.unifiedCountryTrend());
    }
}
