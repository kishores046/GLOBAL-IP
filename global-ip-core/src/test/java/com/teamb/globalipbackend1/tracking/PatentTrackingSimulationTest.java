package com.teamb.globalipbackend1.tracking;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
class PatentTrackingSimulationTest {

    @Autowired
    PatentLifecyclePersistenceService lifecycleService;

    @Autowired
    MockLifecycleProvider mockProvider;

    @Test
    void lifecycleShouldExpireWithinTwoMinutes() {

        String userId = "test-user-1";
        String patentId = "US1234567";

        ApplicationLifecycleDto expiring =
                mockProvider.createExpiringLifecycle(patentId);

        lifecycleService.saveLifecycle(userId, expiring);

        ApplicationLifecycleDto stored =
                lifecycleService.getTrackedPatent(userId, patentId);

        assertEquals("EXPIRING", stored.status());

        ApplicationLifecycleDto expired =
                mockProvider.expiredLifecycle(patentId);

        lifecycleService.saveLifecycle(userId, expired);

        ApplicationLifecycleDto updated =
                lifecycleService.getTrackedPatent(userId, patentId);

        assertEquals("EXPIRED", updated.status());
    }
}
