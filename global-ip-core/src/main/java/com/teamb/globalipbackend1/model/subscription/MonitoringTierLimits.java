package com.teamb.globalipbackend1.model.subscription;

import lombok.Builder;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;

@Component
@Getter
public class MonitoringTierLimits {

    private final Map<SubscriptionTier, Limits> limits = Map.of(

            SubscriptionTier.BASIC,
            Limits.builder()
                    .maxCompetitors(3)
                    .maxPatents(10)
                    .filingCheckInterval(Duration.ofDays(7))   // weekly
                    .lifecycleCheckInterval(Duration.ofDays(7))
                    .realTimeAlerts(false)
                    .build(),

            SubscriptionTier.PRO,
            Limits.builder()
                    .maxCompetitors(20)
                    .maxPatents(100)
                    .filingCheckInterval(Duration.ofDays(1))   // daily
                    .lifecycleCheckInterval(Duration.ofDays(1))
                    .realTimeAlerts(true)
                    .build(),

            SubscriptionTier.ENTERPRISE,
            Limits.builder()
                    .maxCompetitors(Integer.MAX_VALUE)
                    .maxPatents(Integer.MAX_VALUE)
                    .filingCheckInterval(Duration.ofHours(6))
                    .lifecycleCheckInterval(Duration.ofHours(6))
                    .realTimeAlerts(true)
                    .build()
    );

    @Builder
    @Getter
    public static class Limits {
        private int maxCompetitors;
        private int maxPatents;
        private Duration filingCheckInterval;
        private Duration lifecycleCheckInterval;
        private boolean realTimeAlerts;
    }
}
