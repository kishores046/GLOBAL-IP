package com.teamb.globalipbackend1.tracking;

import com.teamb.globalipbackend1.dto.tracking.PatentTrackingEventDto;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId;
import com.teamb.globalipbackend1.service.tracking.PatentTrackingNotificationService;
import com.teamb.globalipbackend1.service.tracking.TrackingPreferencesService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PatentTrackingNotificationServiceTest {

    SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
    TrackingPreferencesService preferencesService = mock(TrackingPreferencesService.class);

    PatentTrackingNotificationService service =
            new PatentTrackingNotificationService(messagingTemplate, preferencesService);

    @Test
    void shouldSendDashboardNotification_whenPreferenceEnabled() {

        // given
        UserTrackingPreferences prefs = new UserTrackingPreferences();
        prefs.setId(new UserTrackingPreferencesId("user1", "US123"));
        prefs.setTrackStatusChanges(true);
        prefs.setEnableDashboardAlerts(true);

        when(preferencesService.getUsersTrackingPatent("US123"))
                .thenReturn(List.of(prefs));

        PatentTrackingEventDto event = new PatentTrackingEventDto(
                "US123",
                "STATUS_CHANGE",
                "Status changed",
                "PENDING",
                "GRANTED",
                LocalDateTime.now(),
                "INFO"
        );

        // when
        service.broadcastToTrackingUsers("US123", event);

        // then
        verify(messagingTemplate, times(1))
                .convertAndSendToUser(
                        eq("user1"),
                        eq("/queue/patent-events"),
                        eq(event)
                );
    }

    @Test
    void shouldNotSendNotification_whenDashboardAlertsDisabled() {

        UserTrackingPreferences prefs = new UserTrackingPreferences();
        prefs.setId(new UserTrackingPreferencesId("user1", "US123"));
        prefs.setTrackStatusChanges(true);
        prefs.setEnableDashboardAlerts(false); // ❌ disabled

        when(preferencesService.getUsersTrackingPatent("US123"))
                .thenReturn(List.of(prefs));

        PatentTrackingEventDto event = new PatentTrackingEventDto(
                "US123",
                "STATUS_CHANGE",
                "Status changed",
                "PENDING",
                "GRANTED",
                LocalDateTime.now(),
                "INFO"
        );

        service.broadcastToTrackingUsers("US123", event);

        verify(messagingTemplate, never()).convertAndSendToUser(any(), any(), any());
    }
}
