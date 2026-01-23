package com.teamb.globalipbackend1.service.tracking;

import com.teamb.globalipbackend1.dto.tracking.PatentTrackingEventDto;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.model.subscription.SubscriptionStatus;
import com.teamb.globalipbackend1.model.subscription.SubscriptionTier;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentTrackingNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final TrackingPreferencesService trackingPreferencesService;
    private final MonitoringSubscriptionRepository subscriptionRepository;

    /**
     * Send notification to a specific user
     */
    public void sendUserNotification(String userId, PatentTrackingEventDto event) {

        var subscriptionOpt =
                subscriptionRepository.findByUserIdAndTypeAndStatus(
                        userId,
                        MonitoringType.LEGAL_STATUS,
                        SubscriptionStatus.ACTIVE
                );

        if (subscriptionOpt.isEmpty()) {
            log.debug("User={} has no active LEGAL_STATUS subscription. Skipping notification.", userId);
            return;
        }

        var subscription = subscriptionOpt.get();


        if (subscription.getTier() == SubscriptionTier.BASIC &&
                ("EXPIRY_WARNING".equals(event.eventType()) ||
                        "RENEWAL_REMINDER".equals(event.eventType()))) {
            log.debug("Skipping {} for BASIC user={}", event.eventType(), userId);
            return;
        }

        String destination = "/user/" + userId + "/queue/patent-events";

        log.info("Sending notification to user={}, destination={}, event={}",
                userId, destination, event.eventType());

        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/patent-events",
                    event
            );
            log.info("Notification sent successfully to user={}", userId);
        } catch (Exception e) {
            log.error("Failed to send notification to user={}", userId, e);
        }
    }

    /**
     * Broadcast notification to all users tracking a specific patent
     */
    public void broadcastToTrackingUsers(String patentId, PatentTrackingEventDto event) {
        log.info("Broadcasting event={} for patent={}", event.eventType(), patentId);

        List<UserTrackingPreferences> trackingUsers =
                trackingPreferencesService.getUsersTrackingPatent(patentId);

        log.info("Found {} users tracking patent={}", trackingUsers.size(), patentId);

        for (UserTrackingPreferences prefs : trackingUsers) {
            String userId = prefs.getId().getUserId();

            // Existing preference check (UNCHANGED)
            if (shouldNotifyUser(prefs, event.eventType())) {
                sendUserNotification(userId, event);
            }
        }
    }

    /**
     * Send lifecycle event notification
     */
    public void notifyLifecycleEvent(
            String patentId,
            String previousStatus,
            String currentStatus,
            String message
    ) {
        PatentTrackingEventDto event = new PatentTrackingEventDto(
                patentId,
                "LIFECYCLE_UPDATE",
                message,
                previousStatus,
                currentStatus,
                LocalDateTime.now(),
                determineSeverity(currentStatus)
        );

        broadcastToTrackingUsers(patentId, event);
    }

    /**
     * Send status change notification
     */
    public void notifyStatusChange(
            String patentId,
            String previousStatus,
            String currentStatus
    ) {
        String message = String.format(
                "Patent status changed from '%s' to '%s'",
                previousStatus,
                currentStatus
        );

        PatentTrackingEventDto event = new PatentTrackingEventDto(
                patentId,
                "STATUS_CHANGE",
                message,
                previousStatus,
                currentStatus,
                LocalDateTime.now(),
                determineSeverity(currentStatus)
        );

        broadcastToTrackingUsers(patentId, event);
    }

    /**
     * Send renewal reminder notification
     */
    public void notifyRenewalReminder(
            String patentId,
            String renewalDate,
            int daysUntilRenewal
    ) {
        String message = String.format(
                "Renewal due in %d days (on %s)",
                daysUntilRenewal,
                renewalDate
        );

        PatentTrackingEventDto event = new PatentTrackingEventDto(
                patentId,
                "RENEWAL_REMINDER",
                message,
                null,
                renewalDate,
                LocalDateTime.now(),
                daysUntilRenewal <= 30 ? "WARNING" : "INFO"
        );

        broadcastToTrackingUsers(patentId, event);
    }

    /**
     * Send expiry warning notification
     */
    public void notifyExpiryWarning(
            String patentId,
            String expiryDate,
            int daysUntilExpiry
    ) {
        String message = String.format(
                "Patent expires in %d days (on %s)",
                daysUntilExpiry,
                expiryDate
        );

        PatentTrackingEventDto event = new PatentTrackingEventDto(
                patentId,
                "EXPIRY_WARNING",
                message,
                null,
                expiryDate,
                LocalDateTime.now(),
                daysUntilExpiry <= 60 ? "CRITICAL" : "WARNING"
        );

        broadcastToTrackingUsers(patentId, event);
    }

    /**
     * Determine if a user should be notified based on their preferences
     */
    private boolean shouldNotifyUser(UserTrackingPreferences prefs, String eventType) {
        return switch (eventType) {
            case "LIFECYCLE_UPDATE" -> prefs.getTrackLifecycleEvents();
            case "STATUS_CHANGE" -> prefs.getTrackStatusChanges();
            case "RENEWAL_REMINDER", "EXPIRY_WARNING" -> prefs.getTrackRenewalsExpiry();
            default -> false;
        } && prefs.getEnableDashboardAlerts();
    }

    /**
     * Determine notification severity based on patent status
     */
    private String determineSeverity(String status) {
        if (status == null) return "INFO";

        return switch (status.toUpperCase()) {
            case "EXPIRED", "ABANDONED", "WITHDRAWN" -> "CRITICAL";
            case "PENDING", "UNDER_REVIEW" -> "WARNING";
            default -> "INFO";
        };
    }
}
