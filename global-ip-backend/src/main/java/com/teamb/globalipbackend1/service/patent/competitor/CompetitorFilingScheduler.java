package com.teamb.globalipbackend1.service.patent.competitor;

import com.teamb.globalipbackend1.dto.competitor.SyncResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(
        value = "competitor.filing.scheduler.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class CompetitorFilingScheduler {

    private final CompetitorFilingService filingService;

    /**
     * Weekly sync - Every Monday at 3 AM
     */
    @Scheduled(cron = "${competitor.filing.scheduler.weekly.cron:0 0 3 * * MON}")
    public void weeklyFilingSync() {
        log.info("=== Starting weekly competitor filing sync ===");

        LocalDate fromDate = LocalDate.now().minusDays(7);

        try {
            SyncResultDTO result = filingService.fetchLatestFilings(fromDate);

            log.info("Weekly sync completed: {} competitors, {} new filings, {} duplicates",
                    result.getCompetitorsProcessed(),
                    result.getNewFilingsFound(),
                    result.getDuplicatesSkipped());

        } catch (Exception e) {
            log.error("Weekly filing sync failed", e);
        }
    }

    /**
     * Daily sync - Every day at 2 AM (optional, disabled by default)
     */
    @Scheduled(
            cron = "${competitor.filing.scheduler.daily.cron:0 0 2 * * *}",
            zone = "${competitor.filing.scheduler.timezone:UTC}"
    )
    @ConditionalOnProperty(
            value = "competitor.filing.scheduler.daily.enabled",
            havingValue = "true"
    )
    public void dailyFilingSync() {
        log.info("=== Starting daily competitor filing sync ===");

        LocalDate fromDate = LocalDate.now().minusDays(1);

        try {
            SyncResultDTO result = filingService.fetchLatestFilings(fromDate);

            log.info("Daily sync completed: {} competitors, {} new filings, {} duplicates",
                    result.getCompetitorsProcessed(),
                    result.getNewFilingsFound(),
                    result.getDuplicatesSkipped());

        } catch (Exception e) {
            log.error("Daily filing sync failed", e);
        }
    }

    /**
     * Monthly full sync - First day of month at 1 AM (optional)
     */
    @Scheduled(
            cron = "${competitor.filing.scheduler.monthly.cron:0 0 1 1 * *}",
            zone = "${competitor.filing.scheduler.timezone:UTC}"
    )
    @ConditionalOnProperty(
            value = "competitor.filing.scheduler.monthly.enabled",
            havingValue = "true"
    )
    public void monthlyFullSync() {
        log.info("=== Starting monthly full competitor filing sync ===");

        LocalDate fromDate = LocalDate.now().minusMonths(3);

        try {
            SyncResultDTO result = filingService.fetchLatestFilings(fromDate);

            log.info("Monthly sync completed: {} competitors, {} new filings, {} duplicates",
                    result.getCompetitorsProcessed(),
                    result.getNewFilingsFound(),
                    result.getDuplicatesSkipped());

        } catch (Exception e) {
            log.error("Monthly filing sync failed", e);
        }
    }
}