package com.teamb.globalipbackend1.service.subscription;

import com.teamb.globalipbackend1.dto.subscription.*;
import com.teamb.globalipbackend1.exception.SubscriptionRequiredException;
import com.teamb.globalipbackend1.model.subscription.*;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitoringSubscriptionService {

    private final MonitoringSubscriptionRepository repository;

    @Transactional
    public SubscriptionResponse createSubscription(
            String userId,
            CreateSubscriptionRequest request
    ) {

        repository.findByUserIdAndTypeAndTierAndAlertFrequencyAndEmailAlertsEnabledAndDashboardAlertsEnabledAndStatus(
                userId,
                request.type(),
                request.tier(),
                request.alertFrequency(),
                request.emailAlertsEnabled(),
                request.dashboardAlertsEnabled(),
                SubscriptionStatus.ACTIVE
        ).ifPresent(existing -> {
            throw new IllegalStateException(
                    "Active subscription already exists for this configuration"
            );
        });

        MonitoringSubscription subscription =
                MonitoringSubscription.builder()
                        .userId(userId)
                        .type(request.type())
                        .tier(request.tier())
                        .alertFrequency(request.alertFrequency())
                        .emailAlertsEnabled(request.emailAlertsEnabled())
                        .dashboardAlertsEnabled(request.dashboardAlertsEnabled())
                        .status(SubscriptionStatus.ACTIVE)
                        .createdAt(LocalDateTime.now())
                        .build();

        repository.save(subscription);

        return new SubscriptionResponse(
                subscription.getId(),
                subscription.getType(),
                subscription.getTier(),
                subscription.getAlertFrequency(),
                subscription.getStatus(),
                subscription.getCreatedAt()
        );
    }


    // -------- VALIDATE --------
    public MonitoringSubscription requireActiveSubscription(
            String userId,
            MonitoringType type
    ) {
        return repository
                .findByUserIdAndTypeAndStatus(
                        userId,
                        type,
                        SubscriptionStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new SubscriptionRequiredException(
                                "No active subscription found. Please create a subscription first."
                        ));
    }

    private SubscriptionResponse toResponse(MonitoringSubscription s) {
        return new SubscriptionResponse(
                s.getId(),
                s.getType(),
                s.getTier(),
                s.getAlertFrequency(),
                s.getStatus(),
                s.getCreatedAt()
        );
    }


    public @Nullable List<SubscriptionResponse> getActiveSubscriptions(String userId) {
        return repository.findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
