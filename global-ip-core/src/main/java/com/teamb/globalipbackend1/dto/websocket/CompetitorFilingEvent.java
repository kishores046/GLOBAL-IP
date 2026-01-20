package com.teamb.globalipbackend1.dto.websocket;

import java.time.LocalDateTime;

public record CompetitorFilingEvent(
        Long competitorId,
        String competitorCode,
        int newFilings,
        String latestPatentId,
        LocalDateTime timestamp
) {}
