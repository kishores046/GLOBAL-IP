package com.teamb.globalipbackend1.scheduler;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentDetailDto;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId;
import com.teamb.globalipbackend1.repository.tracking.UserTrackingPreferencesRepository;
import com.teamb.globalipbackend1.service.patent.detail.PatentsViewDetailsService;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import com.teamb.globalipbackend1.service.tracking.PatentTrackingNotificationService;
import com.teamb.globalipbackend1.util.trackingUtil.PatentSourceDetector;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class UnifiedPatentTrackingSchedulerTest {

    @Mock
    UserTrackingPreferencesRepository trackingRepository;

    @Mock
    PatentsViewDetailsService patentsViewDetailsService;

    @Mock
    PatentLifecyclePersistenceService lifecyclePersistenceService;

    @Mock
    PatentTrackingNotificationService notificationService;

    @Mock
    PatentSourceDetector sourceDetector;

    @InjectMocks
    UnifiedPatentTrackingScheduler scheduler;

    @Test
    void shouldDetectStatusChangeAndNotify() {
        // given
        String patentId = "US1234567";
        String userId = "user-1";

        UserTrackingPreferences prefs = mock(UserTrackingPreferences.class);
        when(prefs.getId()).thenReturn(
                new com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId(userId, patentId)
        );
        when(prefs.getTrackStatusChanges()).thenReturn(true);
        when(prefs.getTrackLifecycleEvents()).thenReturn(false);

        when(trackingRepository.findAll()).thenReturn(List.of(prefs));
        when(sourceDetector.isUsPatent(patentId)).thenReturn(true);

        ApplicationLifecycleDto stored =
                new ApplicationLifecycleDto(
                        patentId,
                        null,
                        null,
                        LocalDate.now().plusYears(5),
                        "PENDING"
                );

        ApplicationLifecycleDto current =
                new ApplicationLifecycleDto(
                        patentId,
                        null,
                        LocalDate.now(),
                        LocalDate.now().plusYears(5),
                        "GRANTED"
                );

        when(lifecyclePersistenceService.getTrackedPatent(userId, patentId))
                .thenReturn(stored);

        PatentDetailDto patentDetail = mock(PatentDetailDto.class);
        when(patentDetail.getLifecycle()).thenReturn(current);

        when(patentsViewDetailsService.fetchPatentDetail(patentId))
                .thenReturn(patentDetail);

        // when
        scheduler.checkAllPatentUpdates();

        // then
        verify(notificationService).notifyStatusChange(
                patentId,
                "PENDING",
                "GRANTED"
        );

        verify(lifecyclePersistenceService)
                .saveLifecycle(eq(userId), eq(current));
    }
}
