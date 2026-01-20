package com.teamb.globalipbackend1.tracking;

import com.teamb.globalipbackend1.dto.tracking.PatentTrackingEventDto;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.model.subscription.MonitoringSubscription;
import com.teamb.globalipbackend1.model.subscription.SubscriptionStatus;
import com.teamb.globalipbackend1.model.subscription.SubscriptionTier;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import com.teamb.globalipbackend1.service.tracking.PatentTrackingNotificationService;
import com.teamb.globalipbackend1.service.tracking.TrackingPreferencesService;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

class PatentTrackingNotificationServiceTest {

    SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
    TrackingPreferencesService preferencesService = mock(TrackingPreferencesService.class);
    MonitoringSubscriptionRepository subscriptionRepository = mock(MonitoringSubscriptionRepository.class);

    PatentTrackingNotificationService service =
            new PatentTrackingNotificationService(
                    messagingTemplate,
                    preferencesService,
                    subscriptionRepository
            );

    private MonitoringSubscription activeSubscription() {
        return MonitoringSubscription.builder()
                .userId("user1")
                .type(MonitoringType.LEGAL_STATUS)
                .tier(SubscriptionTier.PRO)
                .status(SubscriptionStatus.ACTIVE)
                .build();
    }

    @Test
    void shouldSendDashboardNotification_whenPreferenceEnabled_andSubscriptionActive() {

        // given
        UserTrackingPreferences prefs = new UserTrackingPreferences();
        prefs.setId(new UserTrackingPreferencesId("user1", "US123"));
        prefs.setTrackStatusChanges(true);
        prefs.setEnableDashboardAlerts(true);

        when(preferencesService.getUsersTrackingPatent("US123"))
                .thenReturn(List.of(prefs));

        when(subscriptionRepository.findByUserIdAndTypeAndStatus(
                "user1",
                MonitoringType.LEGAL_STATUS,
                SubscriptionStatus.ACTIVE
        )).thenReturn(Optional.of(activeSubscription()));

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
    void shouldNotSendNotification_whenDashboardAlertsDisabled_evenWithSubscription() {

        UserTrackingPreferences prefs = new UserTrackingPreferences();
        prefs.setId(new UserTrackingPreferencesId("user1", "US123"));
        prefs.setTrackStatusChanges(true);
        prefs.setEnableDashboardAlerts(false);

        when(preferencesService.getUsersTrackingPatent("US123"))
                .thenReturn(List.of(prefs));

        when(subscriptionRepository.findByUserIdAndTypeAndStatus(
                "user1",
                MonitoringType.LEGAL_STATUS,
                SubscriptionStatus.ACTIVE
        )).thenReturn(Optional.of(activeSubscription()));

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

        verify(messagingTemplate, never())
                .convertAndSendToUser(any(), any(), any());
    }

    @Test
    void shouldNotSendNotification_whenNoActiveSubscription() {

        UserTrackingPreferences prefs = new UserTrackingPreferences();
        prefs.setId(new UserTrackingPreferencesId("user1", "US123"));
        prefs.setTrackStatusChanges(true);
        prefs.setEnableDashboardAlerts(true);

        when(preferencesService.getUsersTrackingPatent("US123"))
                .thenReturn(List.of(prefs));

        when(subscriptionRepository.findByUserIdAndTypeAndStatus(
                "user1",
                MonitoringType.LEGAL_STATUS,
                SubscriptionStatus.ACTIVE
        )).thenReturn(Optional.empty());

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

        verify(messagingTemplate, never())
                .convertAndSendToUser(any(), any(), any());
    }
}
