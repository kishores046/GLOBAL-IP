package com.teamb.globalipbackend1.tracking;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import com.teamb.globalipbackend1.service.tracking.PatentTrackingNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MockPatentTrackingTestScheduler {

    private final PatentLifecyclePersistenceService lifecycleService;
    private final PatentTrackingNotificationService notificationService;
    private final MockLifecycleProvider mockProvider;

    // Runs every minute for testing
    @Scheduled(fixedRate = 60_000)
    public void simulateLifecycleEnd() {

        String testUser = "test-user-1";
        String patentId = "US1234567";

        ApplicationLifecycleDto current =
                lifecycleService.getTrackedPatent(testUser, patentId);

        if (current == null) {
            // First run — save expiring lifecycle
            ApplicationLifecycleDto expiring =
                    mockProvider.createExpiringLifecycle(patentId);

            lifecycleService.saveLifecycle(testUser, expiring);

            log.info("Saved initial EXPIRING lifecycle for {}", patentId);
            return;
        }

        if (!"EXPIRED".equals(current.status())) {
            ApplicationLifecycleDto expired =
                    mockProvider.expiredLifecycle(patentId);

            notificationService.notifyStatusChange(
                    patentId,
                    current.status(),
                    expired.status()
            );

            lifecycleService.saveLifecycle(testUser, expired);

            log.info("Lifecycle moved to EXPIRED for {}", patentId);
        }
    }
}

