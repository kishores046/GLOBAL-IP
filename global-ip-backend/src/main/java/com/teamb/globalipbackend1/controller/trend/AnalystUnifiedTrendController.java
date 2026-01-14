package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedYearTrendDto;
import com.teamb.globalipbackend1.service.trend.UnifiedTrendService;
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
@RequestMapping("/api/analyst/unified/trends")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
@Slf4j
public class AnalystUnifiedTrendController {

    private final UnifiedTrendService unifiedTrendService;

    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<UnifiedYearTrendDto>> filings() {
        log.info("[UNIFIED] Analyst filing trend request");
        return ResponseEntity.ok(unifiedTrendService.getUnifiedFilingTrend());
    }

    @GetMapping("/countries")
    public ResponseEntity<@NonNull List<UnifiedCountryTrendDto>> countries() {
        log.info("[UNIFIED] Analyst country trend request");
        return ResponseEntity.ok(unifiedTrendService.getUnifiedCountryTrend());
    }
}
