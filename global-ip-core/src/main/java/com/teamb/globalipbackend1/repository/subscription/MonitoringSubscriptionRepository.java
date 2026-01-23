package com.teamb.globalipbackend1.repository.subscription;

import com.teamb.globalipbackend1.model.subscription.*;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MonitoringSubscriptionRepository
        extends JpaRepository<@NonNull MonitoringSubscription, @NonNull Long> {

    Optional<MonitoringSubscription>
    findByUserIdAndTypeAndStatus(
            String userId,
            MonitoringType type,
            SubscriptionStatus status
    );

    List<MonitoringSubscription>
    findByTypeAndStatus(
            MonitoringType type,
            SubscriptionStatus status
    );

    Collection<MonitoringSubscription> findByUserIdAndStatus(String userId, SubscriptionStatus subscriptionStatus);
    Optional<MonitoringSubscription> findByUserIdAndTypeAndTierAndAlertFrequencyAndEmailAlertsEnabledAndDashboardAlertsEnabledAndStatus(
            String userId,
            MonitoringType type,
            SubscriptionTier tier,
            AlertFrequency alertFrequency,
            boolean emailAlertsEnabled,
            boolean dashboardAlertsEnabled,
            SubscriptionStatus status
    );
}
