package com.teamb.globalipbackend1.controller.competitor;

import com.teamb.globalipbackend1.dto.competitor.*;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.competitor.CompetitorFilingService;
import com.teamb.globalipbackend1.service.subscription.MonitoringSubscriptionService;
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

    @PostMapping("/sync")
    public SyncResultDTO syncLatestFilings(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        guard();
        return filingService.fetchLatestFilings(fromDate);
    }

    @GetMapping("/competitor/{competitorId}")
    public List<CompetitorFilingDTO> getFilingsForCompetitor(
            @PathVariable Long competitorId
    ) {
        guard();
        return filingService.getFilingsForCompetitor(competitorId);
    }

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

    @PostMapping("/search")
    public Page<@NonNull CompetitorFilingDTO> searchFilings(
            @RequestBody FilingSearchRequest request
    ) {
        guard();
        return filingService.searchFilings(request);
    }

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

    @GetMapping("/trends/monthly")
    public Map<String, Map<String, Long>> getMonthlyFilingTrends(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        guard();
        return filingService.getMonthlyFilingTrends(fromDate);
    }

    @GetMapping("/summary")
    public FilingSummaryDTO getFilingSummary() {
        guard();
        return filingService.getFilingSummary();
    }
}
