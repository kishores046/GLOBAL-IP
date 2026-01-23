package com.teamb.globalipbackend1.controller.competitor;

import com.teamb.globalipbackend1.dto.competitor.*;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.competitor.CompetitorFilingService;
import com.teamb.globalipbackend1.service.subscription.MonitoringSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/competitors/filings")
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
@Tag(
        name = "Competitor Filings",
        description = "Competitor patent filing monitoring, trends, and analytics"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@RequiredArgsConstructor
@Slf4j
public class CompetitorFilingController {

    private final CompetitorFilingService filingService;
    private final MonitoringSubscriptionService subscriptionService;
    private final SecurityUtil securityUtil;

    private void guard() {
        subscriptionService.requireActiveSubscription(
                securityUtil.getUserId(),
                MonitoringType.COMPETITOR_FILING
        );
    }

    @Operation(
            summary = "Sync latest competitor filings",
            description = "Fetches and stores the latest competitor filings from external sources starting from the given date. "
                    + "Requires an active competitor filing subscription.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filings synced successfully"),
                    @ApiResponse(responseCode = "403", description = "Subscription inactive or forbidden")
            }
    )

    @PostMapping("/sync")
    public SyncResultDTO syncLatestFilings(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        guard();
        return filingService.fetchLatestFilings(fromDate);
    }
    @Operation(
            summary = "Get filings for competitor",
            description = "Returns all filings associated with a specific competitor.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filings retrieved successfully"),
                    @ApiResponse(responseCode = "403", description = "Subscription inactive or forbidden")
            }
    )

    @GetMapping("/competitor/{competitorId}")
    public List<CompetitorFilingDTO> getFilingsForCompetitor(
            @PathVariable Long competitorId
    ) {
        guard();
        return filingService.getFilingsForCompetitor(competitorId);
    }

    @Operation(
            summary = "Get filings for competitor (paginated)",
            description = "Returns paginated competitor filings for large datasets.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Paginated filings returned successfully")
            }
    )

    @GetMapping("/competitor/{competitorId}/page")
    public Page<@NonNull CompetitorFilingDTO> getFilingsForCompetitorPaginated(
            @PathVariable Long competitorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        guard();
        return filingService.getFilingsForCompetitorPaginated(
                competitorId, page, size
        );
    }

    @Operation(
            summary = "Search competitor filings",
            description = "Search competitor filings using advanced filters such as keyword, date range, and jurisdiction.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Search results returned successfully")
            }
    )
    @PostMapping("/search")
    public Page<@NonNull CompetitorFilingDTO> searchFilings(
            @RequestBody FilingSearchRequest request
    ) {
        guard();
        return filingService.searchFilings(request);
    }
    @Operation(
            summary = "Get filing trends",
            description = "Returns filing trends over time for competitors. "
                    + "If no date is provided, defaults to Jan 1, 2020.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filing trends returned successfully")
            }
    )

    @GetMapping("/trends")
    public List<FilingTrendDTO> getFilingTrends(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        guard();
        return filingService.getFilingTrends(
                fromDate != null ? fromDate : LocalDate.of(2020, 1, 1)
        );
    }

    @Operation(
            summary = "Get monthly filing trends",
            description = "Returns month-wise filing counts grouped by competitor and jurisdiction.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Monthly trends returned successfully")
            }
    )
    @GetMapping("/trends/monthly")
    public Map<String, Map<String, Long>> getMonthlyFilingTrends(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        guard();
        return filingService.getMonthlyFilingTrends(fromDate);
    }

    @Operation(
            summary = "Get filing summary",
            description = "Returns an aggregated summary of competitor filings for dashboard analytics.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filing summary returned successfully")
            }
    )

    @GetMapping("/summary")
    public FilingSummaryDTO getFilingSummary() {
        guard();
        return filingService.getFilingSummary();
    }
}
