package com.teamb.globalipbackend1.model.tracking;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_tracking_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTrackingPreferences {

    @EmbeddedId
    private UserTrackingPreferencesId id;

    @Column(name = "track_lifecycle_events", nullable = false)
    private Boolean trackLifecycleEvents;

    @Column(name = "track_status_changes", nullable = false)
    private Boolean trackStatusChanges;

    @Column(name = "track_renewals_expiry", nullable = false)
    private Boolean trackRenewalsExpiry;

    @Column(name = "enable_dashboard_alerts", nullable = false)
    private Boolean enableDashboardAlerts;

    @Column(name = "enable_email_notifications", nullable = false)
    private Boolean enableEmailNotifications;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}