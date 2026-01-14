package com.teamb.globalipbackend1.dto.tracking;

import java.time.LocalDateTime;

public record PatentTrackingEventDto(
        String patentId,
        String eventType, // LIFECYCLE_UPDATE, STATUS_CHANGE, RENEWAL_REMINDER, EXPIRY_WARNING
        String message,
        String previousValue,
        String currentValue,
        LocalDateTime timestamp,
        String severity // INFO, WARNING, CRITICAL
) {}