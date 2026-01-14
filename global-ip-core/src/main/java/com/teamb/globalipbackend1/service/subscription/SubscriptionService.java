package com.teamb.globalipbackend1.service.subscription;

import com.teamb.globalipbackend1.exception.SubscriptionException;
import com.teamb.globalipbackend1.model.subscription.Subscription;
import com.teamb.globalipbackend1.repository.subscription.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

   private final SubscriptionRepository subscriptionRepo;

    @Transactional
    public void cancelSubscription(String userId) {

        Subscription sub = subscriptionRepo
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() ->
                        new SubscriptionException("No active subscription to cancel"));

        sub.setStatus("EXPIRED");
        sub.setEndDate(LocalDate.now());

        subscriptionRepo.save(sub);
    }

}
