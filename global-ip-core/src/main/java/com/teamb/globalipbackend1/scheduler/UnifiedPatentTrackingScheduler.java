package com.teamb.globalipbackend1.scheduler;

import com.teamb.globalipbackend1.dto.epo.EpoPatentDetailDto;
import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentDetailDto;
import com.teamb.globalipbackend1.model.subscription.MonitoringSubscription;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.model.subscription.SubscriptionStatus;
import com.teamb.globalipbackend1.model.subscription.SubscriptionTier;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import com.teamb.globalipbackend1.repository.tracking.UserTrackingPreferencesRepository;
import com.teamb.globalipbackend1.service.patent.detail.EpoDetailsService;
import com.teamb.globalipbackend1.service.patent.detail.PatentsViewDetailsService;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import com.teamb.globalipbackend1.service.tracking.PatentTrackingNotificationService;
import com.teamb.globalipbackend1.util.trackingUtil.PatentSourceDetector;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Unified scheduler that handles both USPTO and EPO patent tracking
 * Routes to appropriate service based on patent ID format
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UnifiedPatentTrackingScheduler {

    private final UserTrackingPreferencesRepository trackingRepository;
    private final PatentsViewDetailsService patentsViewDetailsService;
    private final EpoDetailsService epoDetailsService;
    private final PatentLifecyclePersistenceService lifecyclePersistenceService;
    private final PatentTrackingNotificationService notificationService;
    private final PatentSourceDetector sourceDetector;
    private final MonitoringSubscriptionRepository subscriptionRepository;

    /**
     * Check for patent updates every hour
     * Handles both USPTO and EPO patents with appropriate rate limiting
     */
    @Async
    @Scheduled(cron = "0 0 * * * ?") // Every hour
    public void checkAllPatentUpdates() {
        log.info("Starting unified patent tracking check");

        try {

            var activeSubs =
                    subscriptionRepository.findByTypeAndStatus(
                            MonitoringType.LEGAL_STATUS,
                            SubscriptionStatus.ACTIVE
                    );

            if (activeSubs.isEmpty()) {
                log.info("No active LEGAL_STATUS subscriptions. Skipping scheduler.");
                return;
            }


            boolean allowHourly =
                    activeSubs.stream().anyMatch(s ->
                            s.getTier() == SubscriptionTier.PRO ||
                                    s.getTier() == SubscriptionTier.ENTERPRISE
                    );

            if (!allowHourly) {
                log.debug("Only BASIC subscriptions present. Skipping hourly execution.");
                return;
            }

            List<String> allowedUsers =
                    activeSubs.stream()
                            .map(MonitoringSubscription::getUserId)
                            .distinct()
                            .toList();

            // Get all tracked patents (FILTERED)
            List<UserTrackingPreferences> allTracking =
                    trackingRepository.findAll().stream()
                            .filter(t -> allowedUsers.contains(t.getId().getUserId()))
                            .toList();

            // Group by patent ID
            Map<String, List<UserTrackingPreferences>> patentGroups = allTracking.stream()
                    .collect(Collectors.groupingBy(p -> p.getId().getPatentId()));

            // Separate USPTO and EPO patents
            Map<String, List<UserTrackingPreferences>> usPatents = patentGroups.entrySet().stream()
                    .filter(e -> sourceDetector.isUsPatent(e.getKey()))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

            Map<String, List<UserTrackingPreferences>> epoPatents = patentGroups.entrySet().stream()
                    .filter(e -> sourceDetector.isEpoPatent(e.getKey()))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

            log.info("Found {} US patents and {} EPO patents to check",
                    usPatents.size(), epoPatents.size());

            // Check US patents (can be checked more frequently)
            for (Map.Entry<String, List<UserTrackingPreferences>> entry : usPatents.entrySet()) {
                checkUsPatent(entry.getKey(), entry.getValue());
                Thread.sleep(500); // 0.5 second delay for US patents
            }

            // Check EPO patents (need more respect for rate limits)
            for (Map.Entry<String, List<UserTrackingPreferences>> entry : epoPatents.entrySet()) {
                checkEpoPatent(entry.getKey(), entry.getValue());
                Thread.sleep(2000); // 2 second delay for EPO patents
            }

            log.info("Completed unified patent tracking check");

        } catch (Exception e) {
            log.error("Error during unified patent tracking check", e);
        }
    }

    /**
     * Check for renewal reminders daily at 9 AM
     * Handles both USPTO and EPO patents
     */
    @Scheduled(cron = "0 0 9 * * ?") // Daily at 9 AM
    public void checkRenewalReminders() {
        log.info("Checking renewal reminders for all patents");

        try {
            var activeSubs =
                    subscriptionRepository.findByTypeAndStatus(
                            MonitoringType.LEGAL_STATUS,
                            SubscriptionStatus.ACTIVE
                    );

            if (activeSubs.isEmpty()) {
                log.info("No active LEGAL_STATUS subscriptions. Skipping renewal reminders.");
                return;
            }

            List<String> allowedUsers =
                    activeSubs.stream()
                            .map(MonitoringSubscription::getUserId)
                            .distinct()
                            .toList();

            List<UserTrackingPreferences> trackingWithRenewals =
                    trackingRepository.findAll().stream()
                            .filter(UserTrackingPreferences::getTrackRenewalsExpiry)
                            .filter(t -> allowedUsers.contains(t.getId().getUserId()))
                            .toList();

            for (UserTrackingPreferences tracking : trackingWithRenewals) {
                String patentId = tracking.getId().getPatentId();
                String userId = tracking.getId().getUserId();

                // Get current lifecycle
                ApplicationLifecycleDto lifecycle = lifecyclePersistenceService
                        .getTrackedPatent(userId, patentId);

                if (lifecycle != null && lifecycle.expirationDate() != null) {
                    checkForRenewalReminders(patentId, lifecycle.expirationDate());
                }

                // Rate limit based on patent source
                if (sourceDetector.isEpoPatent(patentId)) {
                    Thread.sleep(1000); // 1 second for EPO
                } else {
                    Thread.sleep(500);  // 0.5 seconds for US
                }
            }

            log.info("Completed renewal reminder check");

        } catch (Exception e) {
            log.error("Error checking renewal reminders", e);
        }
    }

    /**
     * Check US patent using PatentsView API
     */
    private void checkUsPatent(String patentId, List<UserTrackingPreferences> usersTracking) {
        try {
            log.debug("Checking US patent: {}", patentId);

            // Fetch from PatentsView
            PatentDetailDto currentDetails = patentsViewDetailsService.fetchPatentDetail(patentId);

            if (currentDetails == null) {
                log.warn("Could not fetch US patent details: {}", patentId);
                return;
            }

            // Check for changes
            for (UserTrackingPreferences tracking : usersTracking) {
                String userId = tracking.getId().getUserId();
                checkPatentChanges(userId, patentId, currentDetails.getLifecycle(), tracking);
            }

        } catch (Exception e) {
            log.error("Error checking US patent: {}", patentId, e);
        }
    }

    /**
     * Check EPO patent using EPO OPS API
     */
    private void checkEpoPatent(String patentId, List<UserTrackingPreferences> usersTracking) {
        try {
            log.debug("Checking EPO patent: {}", patentId);

            // Fetch from EPO API
            EpoPatentDetailDto currentDetails = epoDetailsService.refreshPatentData(patentId);

            if (currentDetails == null) {
                log.warn("Could not fetch EPO patent details: {}", patentId);
                return;
            }

            // Check for changes
            for (UserTrackingPreferences tracking : usersTracking) {
                String userId = tracking.getId().getUserId();
                checkPatentChanges(userId, patentId, currentDetails.getLifecycle(), tracking);
            }

        } catch (Exception e) {
            log.error("Error checking EPO patent: {}", patentId, e);
        }
    }

    /**
     * Check for patent changes and send notifications
     * Common logic for both US and EPO patents
     */
    private void checkPatentChanges(
            String userId,
            String patentId,
            ApplicationLifecycleDto currentLifecycle,
            UserTrackingPreferences tracking
    ) {
        // Get stored lifecycle
        ApplicationLifecycleDto storedLifecycle = lifecyclePersistenceService
                .getTrackedPatent(userId, patentId);

        if (storedLifecycle == null) {
            // First time tracking - save current state
            lifecyclePersistenceService.saveLifecycle(userId, currentLifecycle);
            return;
        }

        // Check for status changes
        if (tracking.getTrackStatusChanges() &&
                !storedLifecycle.status().equals(currentLifecycle.status())) {

            log.info("Status change detected for patent={}: {} -> {}",
                    patentId, storedLifecycle.status(), currentLifecycle.status());

            notificationService.notifyStatusChange(
                    patentId,
                    storedLifecycle.status(),
                    currentLifecycle.status()
            );

            // Update stored lifecycle
            lifecyclePersistenceService.saveLifecycle(userId, currentLifecycle);
        }

        // Check for lifecycle events (date changes)
        if (tracking.getTrackLifecycleEvents()) {
            checkLifecycleChanges(patentId, storedLifecycle, currentLifecycle);
        }
    }

    /**
     * Check for lifecycle date changes
     */
    private void checkLifecycleChanges(
            String patentId,
            ApplicationLifecycleDto stored,
            ApplicationLifecycleDto current
    ) {
        // Check grant date change
        if (stored.grantDate() == null && current.grantDate() != null) {
            String source = sourceDetector.isEpoPatent(patentId) ? "EPO" : "US";
            notificationService.notifyLifecycleEvent(
                    patentId,
                    "Pending",
                    "Granted",
                    String.format("%s patent has been granted on %s", source, current.grantDate())
            );
        }

        // Check expiration date change
        if ((stored.expirationDate() == null && current.expirationDate() != null) ||
                (stored.expirationDate() != null && current.expirationDate() != null &&
                        !stored.expirationDate().equals(current.expirationDate()))) {

            notificationService.notifyLifecycleEvent(
                    patentId,
                    stored.expirationDate() != null ? stored.expirationDate().toString() : "Unknown",
                    current.expirationDate().toString(),
                    "Patent expiration date updated to " + current.expirationDate()
            );
        }
    }

    /**
     * Check for renewal reminders based on expiration date
     */
    private void checkForRenewalReminders(String patentId, LocalDate expirationDate) {
        LocalDate today = LocalDate.now();
        long daysUntilExpiry = ChronoUnit.DAYS.between(today, expirationDate);

        // Different reminder intervals for EPO vs US
        boolean isEpo = sourceDetector.isEpoPatent(patentId);
        List<Integer> reminderDays = isEpo
                ? List.of(365, 180, 90, 30)  // EPO: annual fees
                : List.of(90, 60, 30);        // US: maintenance fees

        if (reminderDays.contains((int) daysUntilExpiry)) {
            log.info("Sending renewal reminder for patent={}, days until expiry={}",
                    patentId, daysUntilExpiry);

            notificationService.notifyRenewalReminder(
                    patentId,
                    expirationDate.toString(),
                    (int) daysUntilExpiry
            );
        }

        // Send expiry warnings
        if (daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
            notificationService.notifyExpiryWarning(
                    patentId,
                    expirationDate.toString(),
                    (int) daysUntilExpiry
            );
        }
    }
}