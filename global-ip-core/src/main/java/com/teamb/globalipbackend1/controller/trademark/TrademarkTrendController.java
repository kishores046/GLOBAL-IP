package com.teamb.globalipbackend1.controller.trademark;



import com.teamb.globalipbackend1.dto.trademark.trend.*;
import com.teamb.globalipbackend1.service.trademark.TrademarkTrendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trends/trademarks")
@PreAuthorize("hasAnyRole('ADMIN','ANALYST')")

@Tag(
        name = "Trademark Trends",
        description = "Aggregated trademark trend analytics for dashboards and reports"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
public class TrademarkTrendController {

    private final TrademarkTrendService service;



    @Operation(
            summary = "Trademark trend summary",
            description = "Returns high-level trademark trend metrics for dashboards.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Trend summary returned successfully")
            }
    )

    @GetMapping("/summary")
    public ResponseEntity<@NonNull Map<String, Object>> summary() {
        return ResponseEntity.ok(service.summary());
    }

    @Operation(
            summary = "Top trademark classes",
            description = "Returns the most frequently used trademark classes.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Top classes returned successfully")
            }
    )
    @GetMapping("/classes/top")
    public ResponseEntity<@NonNull List<CodeDistributionDto>> topClasses() {
        return ResponseEntity.ok(service.topClasses());
    }

    @Operation(
            summary = "Top trademark countries",
            description = "Returns countries with the highest trademark filing counts.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Top countries returned successfully")
            }
    )
    @GetMapping("/countries/top")
    public ResponseEntity<@NonNull List<SimpleCountDto>> topCountries() {
        return ResponseEntity.ok(service.topCountries());
    }

    @Operation(
            summary = "Trademark status distribution",
            description = "Returns distribution of trademarks by legal status.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Status distribution returned successfully")
            }
    )
    @GetMapping("/status")
    public ResponseEntity<@NonNull List<SimpleCountDto>> statusDistribution() {
        return ResponseEntity.ok(service.statusDistribution());
    }
}
