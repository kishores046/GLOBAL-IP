package com.teamb.globalipbackend1.controller.competitor;

import com.teamb.globalipbackend1.dto.competitor.*;
import com.teamb.globalipbackend1.service.patent.competitor.CompetitorFilingService;
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

    /**
     * Trigger filing sync for all active competitors
     */
    @PostMapping("/sync")
    public SyncResultDTO syncLatestFilings(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        log.info("Triggering competitor filing sync from {}", fromDate);
        return filingService.fetchLatestFilings(fromDate);
    }

    /**
     * Get all filings for a competitor (non-paginated)
     */
    @GetMapping("/competitor/{competitorId}")
    public List<CompetitorFilingDTO> getFilingsForCompetitor(
            @PathVariable Long competitorId
    ) {
        return filingService.getFilingsForCompetitor(competitorId);
    }

    /**
     * Get paginated filings for a competitor
     */
    @GetMapping("/competitor/{competitorId}/page")
    public Page<@NonNull CompetitorFilingDTO> getFilingsForCompetitorPaginated(
            @PathVariable Long competitorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return filingService.getFilingsForCompetitorPaginated(
                competitorId,
                page,
                size
        );
    }

    /**
     * Search filings with filters
     */
    @PostMapping("/search")
    public Page<@NonNull CompetitorFilingDTO> searchFilings(
            @RequestBody FilingSearchRequest request
    ) {
        return filingService.searchFilings(request);
    }

    /**
     * Filing trends since a given date
     */
    @GetMapping("/trends")
    public List<FilingTrendDTO> getFilingTrends(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        if (fromDate == null) {
            fromDate = LocalDate.of(2020, 1, 1);
        }
        return filingService.getFilingTrends(fromDate);
    }


    /**
     * Monthly filing trends per competitor
     */
    @GetMapping("/trends/monthly")
    public Map<String, Map<String, Long>> getMonthlyFilingTrends(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate
    ) {
        return filingService.getMonthlyFilingTrends(fromDate);
    }

    /**
     * Filing summary dashboard stats
     */
    @GetMapping("/summary")
    public FilingSummaryDTO getFilingSummary() {
        return filingService.getFilingSummary();
    }
}
