package com.teamb.globalipbackend1.dto.subscription;

import com.teamb.globalipbackend1.model.subscription.*;

import java.time.LocalDateTime;

public record SubscriptionResponse(
        Long id,
        MonitoringType type,
        SubscriptionTier tier,
        AlertFrequency alertFrequency,
        SubscriptionStatus status,
        LocalDateTime createdAt
) {}
