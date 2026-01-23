package com.teamb.globalipbackend1.service.websocket;

import com.teamb.globalipbackend1.dto.websocket.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;


    public void sendCompetitorFilingUpdate(
            String userId,
            CompetitorFilingEvent event
    ) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/competitor-filings",
                event
        );
    }
}
