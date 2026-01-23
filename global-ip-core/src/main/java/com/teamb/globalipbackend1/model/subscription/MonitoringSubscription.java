package com.teamb.globalipbackend1.model.subscription;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "monitoring_subscriptions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_active_subscription_per_config",
                        columnNames = {
                                "user_id",
                                "type",
                                "tier",
                                "alert_frequency",
                                "email_alerts_enabled",
                                "dashboard_alerts_enabled",
                                "status"
                        }
                )
        }
)
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonitoringSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionTier tier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitoringType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertFrequency alertFrequency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    private Boolean emailAlertsEnabled;
    private Boolean dashboardAlertsEnabled;

    private LocalDateTime createdAt;
}
