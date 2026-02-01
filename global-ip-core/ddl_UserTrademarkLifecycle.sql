CREATE TABLE user_trademark_lifecycle
(
    user_id         VARCHAR(255) NOT NULL,
    trademark_id    VARCHAR(255) NOT NULL,
    status          VARCHAR(255),
    raw_status_code VARCHAR(255),
    filing_date     date,
    last_updated    date,
    CONSTRAINT pk_user_trademark_lifecycle PRIMARY KEY (user_id, trademark_id)
);