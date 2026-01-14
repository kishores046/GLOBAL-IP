package com.teamb.globalipbackend1.repository.subscription;

import com.teamb.globalipbackend1.model.subscription.Subscription;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<@NonNull Subscription, @NonNull Long> {

    Optional<Subscription> findByUserIdAndStatus(String userId, String status);
}
