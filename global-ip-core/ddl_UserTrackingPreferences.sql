CREATE TABLE user_tracking_preferences
(
    track_lifecycle_events     BOOLEAN      NOT NULL,
    track_status_changes       BOOLEAN      NOT NULL,
    track_renewals_expiry      BOOLEAN      NOT NULL,
    enable_dashboard_alerts    BOOLEAN      NOT NULL,
    enable_email_notifications BOOLEAN      NOT NULL,
    created_at                 TIMESTAMP    NOT NULL,
    updated_at                 TIMESTAMP    NOT NULL,
    user_id                    VARCHAR(255) NOT NULL,
    patent_id                  VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_tracking_preferences PRIMARY KEY (user_id, patent_id)
);