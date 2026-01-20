package com.teamb.globalipbackend1.service.subscription;

import com.teamb.globalipbackend1.exception.SubscriptionRequiredException;
import com.teamb.globalipbackend1.model.subscription.*;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import com.teamb.globalipbackend1.model.subscription.MonitoringTierLimits;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionGuardService {

    private final MonitoringSubscriptionRepository subscriptionRepo;
    private final MonitoringTierLimits tierLimits;

    public MonitoringSubscription requireActive(
            String userId,
            MonitoringType type
    ) {
        return subscriptionRepo
                .findByUserIdAndTypeAndStatus(
                        userId,
                        type,
                        SubscriptionStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new SubscriptionRequiredException(
                                "No active subscription. Please create a subscription first."
                        ));
    }

    public MonitoringTierLimits.Limits limitsFor(MonitoringSubscription sub) {
        return tierLimits.getLimits().get(sub.getTier());
    }
}
