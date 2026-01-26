package com.teamb.globalipbackend1.controller.tracking;

import com.teamb.globalipbackend1.dto.tracking.TrackingPreferencesDto;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.tracking.TrackingPreferencesService;
import com.teamb.globalipbackend1.util.trackingUtil.PatentSourceDetector;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "Patent Tracking",
        description = "Unified patent tracking preferences across USPTO and EPO sources"
)
@SecurityRequirement(name = "Bearer Authentication")
public class UnifiedPatentTrackingController {

    private final TrackingPreferencesService trackingPreferencesService;
    private final SecurityUtil securityUtil;
    private final PatentSourceDetector sourceDetector;

    /**
     * Save or update tracking preferences for a patent
     * Automatically detects USPTO or EPO based on patent ID
     */
    @Operation(
            summary = "Save or update tracking preferences",
            description = "Creates or updates tracking preferences for a patent. "
                    + "Patent source (USPTO or EPO) is automatically detected.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracking preferences saved successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
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
    @Operation(
            summary = "Get tracking preferences for a patent",
            description = "Returns tracking preferences for a specific patent ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracking preferences returned"),
                    @ApiResponse(responseCode = "404", description = "Tracking preferences not found")
            }
    )
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
    @Operation(
            summary = "Get all tracking preferences",
            description = "Returns all tracked patents for the logged-in user. "
                    + "Optionally filter by patent source (USPTO or EPO).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracking preferences returned successfully")
            }
    )
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
    @Operation(
            summary = "Delete tracking preferences",
            description = "Stops tracking a patent for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Tracking preferences deleted successfully"),
                    @ApiResponse(responseCode = "404", description = "Tracking preferences not found")
            }
    )
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
    @Operation(
            summary = "Check if patent is being tracked",
            description = "Returns true if the given patent is currently tracked by the user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracking status returned")
            }
    )
    @GetMapping("/is-tracking/{patentId}")
    public ResponseEntity<@NonNull Boolean> isTracking(@PathVariable String patentId) {
        String userId = securityUtil.getUserId();

        boolean isTracking = trackingPreferencesService.isTracking(userId, patentId);

        return ResponseEntity.ok(isTracking);
    }

    /**
     * Get patent source information
     */
    @Operation(
            summary = "Get patent source information",
            description = "Returns detected patent source and polling metadata "
                    + "(USPTO or EPO, API used, refresh frequency).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Patent source info returned")
            }
    )
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

    @Operation(
            summary = "Get total tracked patents count",
            description = "Returns the total number of patents currently tracked by the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Total tracking count returned")
            }
    )
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalTrackedPatents() {
        long total = trackingPreferencesService.getTotalTrackedPatents();
        return ResponseEntity.ok(total);
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