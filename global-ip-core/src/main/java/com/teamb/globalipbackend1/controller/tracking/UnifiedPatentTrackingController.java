package com.teamb.globalipbackend1.controller.tracking;

import com.teamb.globalipbackend1.dto.tracking.TrackingPreferencesDto;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.tracking.TrackingPreferencesService;
import com.teamb.globalipbackend1.util.trackingUtil.PatentSourceDetector;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ANALYST','ADMIN','USER')")
@RequestMapping("/api/tracking")
public class UnifiedPatentTrackingController {

    private final TrackingPreferencesService trackingPreferencesService;
    private final SecurityUtil securityUtil;
    private final PatentSourceDetector sourceDetector;

    /**
     * Save or update tracking preferences for a patent
     * Automatically detects USPTO or EPO based on patent ID
     */
    @PostMapping("/preferences")
    public ResponseEntity<@NonNull TrackingPreferencesDto> saveTrackingPreferences(
            @RequestBody TrackingPreferencesDto preferences
    ) {
        String userId = securityUtil.getUserId();
        String patentId = preferences.patentId();

        // Detect source
        PatentSourceDetector.PatentSource source = sourceDetector.detectSource(patentId);

        log.info("Saving tracking preferences for user={}, patent={}, source={}",
                userId, patentId, source);

        TrackingPreferencesDto saved = trackingPreferencesService
                .saveTrackingPreferences(userId, preferences);

        return ResponseEntity.ok(saved);
    }

    /**
     * Get tracking preferences for a specific patent
     * Works for both USPTO and EPO patents
     */
    @GetMapping("/preferences/{patentId}")
    public ResponseEntity<@NonNull TrackingPreferencesDto> getTrackingPreferences(
            @PathVariable String patentId
    ) {
        String userId = securityUtil.getUserId();

        PatentSourceDetector.PatentSource source = sourceDetector.detectSource(patentId);

        log.info("Fetching tracking preferences for user={}, patent={}, source={}",
                userId, patentId, source);

        return trackingPreferencesService.getTrackingPreferences(userId, patentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all tracking preferences for the logged-in user
     * Returns both USPTO and EPO patents
     */
    @GetMapping("/preferences")
    public ResponseEntity<@NonNull List<TrackingPreferencesDto>> getAllTrackingPreferences(
            @RequestParam(required = false) String source
    ) {
        String userId = securityUtil.getUserId();

        log.info("Fetching all tracking preferences for user={}, filter={}", userId, source);

        List<TrackingPreferencesDto> preferences =
                trackingPreferencesService.getAllTrackingPreferences(userId);

        // Filter by source if requested
        if (source != null && !source.isBlank()) {
            preferences = preferences.stream()
                    .filter(pref -> {
                        PatentSourceDetector.PatentSource detectedSource =
                                sourceDetector.detectSource(pref.patentId());
                        return detectedSource.name().equalsIgnoreCase(source);
                    })
                    .toList();
        }

        return ResponseEntity.ok(preferences);
    }

    /**
     * Delete tracking preferences (untrack a patent)
     */
    @DeleteMapping("/preferences/{patentId}")
    public ResponseEntity<@NonNull Void> deleteTrackingPreferences(
            @PathVariable String patentId
    ) {
        String userId = securityUtil.getUserId();

        PatentSourceDetector.PatentSource source = sourceDetector.detectSource(patentId);

        log.info("Deleting tracking preferences for user={}, patent={}, source={}",
                userId, patentId, source);

        trackingPreferencesService.deleteTrackingPreferences(userId, patentId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Check if a patent is being tracked
     */
    @GetMapping("/is-tracking/{patentId}")
    public ResponseEntity<@NonNull Boolean> isTracking(@PathVariable String patentId) {
        String userId = securityUtil.getUserId();

        boolean isTracking = trackingPreferencesService.isTracking(userId, patentId);

        return ResponseEntity.ok(isTracking);
    }

    /**
     * Get patent source information
     */
    @GetMapping("/patent-source/{patentId}")
    public ResponseEntity<@NonNull PatentSourceInfo> getPatentSource(@PathVariable String patentId) {
        PatentSourceDetector.PatentSource source = sourceDetector.detectSource(patentId);

        return ResponseEntity.ok(new PatentSourceInfo(
                patentId,
                source.name(),
                source == PatentSourceDetector.PatentSource.EPO ? "EPO OPS API" : "PatentsView API",
                source == PatentSourceDetector.PatentSource.EPO ? "Every 2 hours" : "Hourly"
        ));
    }


    /**
     * DTO for patent source info
     */
    public record PatentSourceInfo(
            String patentId,
            String source,
            String apiUsed,
            String checkFrequency
    ) {}
}