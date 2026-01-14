

package com.teamb.globalipbackend1.dto.tracking;

public record TrackingPreferencesDto(
        String patentId,
        Boolean trackLifecycleEvents,
        Boolean trackStatusChanges,
        Boolean trackRenewalsExpiry,
        Boolean enableDashboardAlerts,
        Boolean enableEmailNotifications
) {}