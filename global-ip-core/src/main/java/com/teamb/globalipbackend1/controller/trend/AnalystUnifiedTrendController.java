package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedYearTrendDto;
import com.teamb.globalipbackend1.service.trend.UnifiedTrendService;
import com.teamb.globalipbackend1.service.user.TrackGraph;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.TypeRegistration;
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

@Tag(
        name = "Unified Patent Trends",
        description = "Cross-jurisdiction patent trend analytics (USPTO + EPO combined)"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@Slf4j
public class AnalystUnifiedTrendController {

    private final UnifiedTrendService unifiedTrendService;


    @Operation(
            summary = "Unified filing trends",
            description = "Returns combined year-wise patent filing trends across jurisdictions.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Unified filing trends returned successfully")
            }
    )

    @GetMapping("/filings")
    @TrackGraph("FILINGS_UNIFIED")
    public ResponseEntity<@NonNull List<UnifiedYearTrendDto>> filings() {
        log.info("[UNIFIED] Analyst filing trend request");
        return ResponseEntity.ok(unifiedTrendService.getUnifiedFilingTrend());
    }


    @Operation(
            summary = "Unified country trends",
            description = "Returns combined country-wise patent filing trends across jurisdictions.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Unified country trends returned successfully")
            }
    )
    @GetMapping("/countries")
    @TrackGraph("COUNTRIES_UNIFIED")
    public ResponseEntity<@NonNull List<UnifiedCountryTrendDto>> countries() {
        log.info("[UNIFIED] Analyst country trend request");
        return ResponseEntity.ok(unifiedTrendService.getUnifiedCountryTrend());
    }
}
