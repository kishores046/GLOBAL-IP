package com.teamb.globalipbackend1.dto.subscription;

import com.teamb.globalipbackend1.model.subscription.*;

public record CreateSubscriptionRequest(
        MonitoringType type,
        SubscriptionTier tier,
        AlertFrequency alertFrequency,
        boolean emailAlertsEnabled,
        boolean dashboardAlertsEnabled
) {}
