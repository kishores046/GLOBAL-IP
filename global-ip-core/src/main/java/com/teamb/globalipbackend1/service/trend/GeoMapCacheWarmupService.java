package com.teamb.globalipbackend1.service.trend;



import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class GeoMapCacheWarmupService {

    private final PatentAnalyticsService patentAnalyticsService;
    private final EpoTrendAnalyticsService epoTrendAnalyticsService;
    private final UnifiedTrendService unifiedTrendService;

    /**
     * Warm cache immediately after application startup
     */
    @EventListener(ApplicationReadyEvent.class)
    public void warmUpOnStartup() {
        log.info("[GEO-WARMUP] Starting geo-map cache warmup on startup");
        warmUp();
    }

    /**
     * Periodic refresh every 6 hours
     */
    @Scheduled(cron = "0 0 */6 * * *")
    public void scheduledWarmUp() {
        log.info("[GEO-WARMUP] Scheduled geo-map cache refresh");
        warmUp();
    }

    private void warmUp() {
        try {
            // US / PatentView
            patentAnalyticsService.getTopCountries(
                    java.time.LocalDate.of(1900, 1, 1),
                    300
            );

            // EPO
            epoTrendAnalyticsService.countryDistribution();

            // Unified
            unifiedTrendService.getUnifiedCountryTrend();

            log.info("[GEO-WARMUP] Geo-map caches warmed successfully");

        } catch (Exception ex) {
            log.error("[GEO-WARMUP] Geo-map warmup failed", ex);
        }
    }
}
