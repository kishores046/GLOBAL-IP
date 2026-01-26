package com.teamb.globalipbackend1.service.tracking;

import com.teamb.globalipbackend1.dto.tracking.TrackingPreferencesDto;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.model.subscription.SubscriptionStatus;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId;
import com.teamb.globalipbackend1.repository.subscription.MonitoringSubscriptionRepository;
import com.teamb.globalipbackend1.repository.tracking.UserTrackingPreferencesRepository;
import com.teamb.globalipbackend1.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackingPreferencesService {

    private final UserTrackingPreferencesRepository repository;
    private final MonitoringSubscriptionRepository subscriptionRepository;
    private final SecurityUtil securityUtil;

    /**
     * Save or update tracking preferences for a patent
     */
    @Transactional
    public TrackingPreferencesDto saveTrackingPreferences(String userId, TrackingPreferencesDto dto) {
        log.info("Saving tracking preferences for user={}, patent={}", userId, dto.patentId());

        subscriptionRepository
                .findByUserIdAndTypeAndStatus(
                        userId,
                        MonitoringType.LEGAL_STATUS,
                        SubscriptionStatus.ACTIVE
                )
                .orElseThrow(() -> new IllegalStateException(
                        "Create Legal Status Monitoring subscription first"
                ));

        UserTrackingPreferencesId id = new UserTrackingPreferencesId(userId, dto.patentId());

        UserTrackingPreferences entity = repository.findById(id)
                .orElse(UserTrackingPreferences.builder()
                        .id(id)
                        .createdAt(LocalDateTime.now())
                        .build());

        entity.setTrackLifecycleEvents(Boolean.TRUE.equals(dto.trackLifecycleEvents()));
        entity.setTrackStatusChanges(Boolean.TRUE.equals(dto.trackStatusChanges()));
        entity.setTrackRenewalsExpiry(Boolean.TRUE.equals(dto.trackRenewalsExpiry()));
        entity.setEnableDashboardAlerts(Boolean.TRUE.equals(dto.enableDashboardAlerts()));
        entity.setEnableEmailNotifications(Boolean.TRUE.equals(dto.enableEmailNotifications()));
        entity.setUpdatedAt(LocalDateTime.now());

        UserTrackingPreferences saved = repository.save(entity);

        log.info("Tracking preferences saved successfully for patent={}", dto.patentId());

        return toDto(saved);
    }

    /**
     * Get tracking preferences for a specific patent
     */
    public Optional<TrackingPreferencesDto> getTrackingPreferences(String userId, String patentId) {
        log.info("Fetching tracking preferences for user={}, patent={}", userId, patentId);

        return repository.findByIdUserIdAndIdPatentId(userId, patentId)
                .map(this::toDto);
    }

    /**
     * Get all tracked patents for a user with their preferences
     */
    public List<TrackingPreferencesDto> getAllTrackingPreferences(String userId) {
        log.info("Fetching all tracking preferences for user={}", userId);

        return repository.findByIdUserId(userId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Delete tracking preferences (untrack a patent)
     */
    @Transactional
    public void deleteTrackingPreferences(String userId, String patentId) {
        log.info("Deleting tracking preferences for user={}, patent={}", userId, patentId);

        repository.deleteByIdUserIdAndIdPatentId(userId, patentId);

        log.info("Tracking preferences deleted for patent={}", patentId);
    }

    /**
     * Check if a user is tracking a specific patent
     */
    public boolean isTracking(String userId, String patentId) {
        return repository.findByIdUserIdAndIdPatentId(userId, patentId).isPresent();
    }

    /**
     * Get all users tracking a specific patent (for notifications)
     */
    public List<UserTrackingPreferences> getUsersTrackingPatent(String patentId) {
        return repository.findByIdPatentId(patentId);
    }

    /**
     * Convert entity to DTO
     */
    private TrackingPreferencesDto toDto(UserTrackingPreferences entity) {
        return new TrackingPreferencesDto(
                entity.getId().getPatentId(),
                entity.getTrackLifecycleEvents(),
                entity.getTrackStatusChanges(),
                entity.getTrackRenewalsExpiry(),
                entity.getEnableDashboardAlerts(),
                entity.getEnableEmailNotifications()
        );
    }

    public long getTotalTrackedPatents() {
        String userId= securityUtil.getUserId();;
        log.info("Fetching total tracked patents for user={}", userId);
        return repository.countByIdUserId(userId);
    }

}