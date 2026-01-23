package com.teamb.globalipbackend1.controller.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;
import com.teamb.globalipbackend1.service.trend.EpoTrendAnalyticsService;
import com.teamb.globalipbackend1.service.user.TrackGraph;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "EPO Trends",
        description = "Analyst APIs for European Patent Office (EPO) trend analytics"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@Slf4j
public class AnalystEpoTrendController {

    private final EpoTrendAnalyticsService epoService;

    @Operation(
            summary = "EPO filing trends",
            description = "Returns year-wise EPO filing trends for analyst dashboards.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filing trends returned successfully")
            }
    )
    @TrackGraph(value = "EPO_FILLINGS")
    @GetMapping("/filings")
    public ResponseEntity<@NonNull List<EpoYearCountDto>> filings() {
        return ResponseEntity.ok(epoService.filingTrend());
    }

    @Operation(
            summary = "EPO country distribution",
            description = "Returns country-wise distribution of EPO filings.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Country trends returned successfully")
            }
    )

    @GetMapping("/countries")
    @TrackGraph(value = "EPO_COUNTRIES")
    public ResponseEntity<@NonNull List<EpoCountryTrendDto>> countries() {
        return ResponseEntity.ok(epoService.countryDistribution());
    }

    @Operation(
            summary = "Top EPO technologies",
            description = "Returns top technology domains based on EPO filings.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Technology trends returned successfully")
            }
    )

    @GetMapping("/technologies")
    @TrackGraph(value = "EPO_TECHNOLOGY")
    public ResponseEntity<@NonNull List<EpoTechnologyTrendDto>> technologies() {
        return ResponseEntity.ok(epoService.topTechnologies());
    }

    @Operation(
            summary = "Top EPO assignees",
            description = "Returns assignees with the highest EPO filing counts.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Assignee trends returned successfully")
            }
    )

    @GetMapping("/assignees")
    @TrackGraph(value="EPO_ASSIGNEES")
    public ResponseEntity<@NonNull List<EpoAssigneeTrendDto>> assignees() {
        return ResponseEntity.ok(epoService.topAssignees());
    }


    @Operation(
            summary = "EPO family size trends",
            description = "Returns trends of patent family sizes in EPO filings.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Family size trends returned successfully")
            }
    )

    @GetMapping("/families")
    @TrackGraph(value = "FAMILIES")
    public ResponseEntity<@NonNull List<EpoFamilyTrendDto>> families() {
        return ResponseEntity.ok(epoService.familySizeTrend());
    }
}
