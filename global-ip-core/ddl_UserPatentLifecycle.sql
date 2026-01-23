CREATE TABLE user_patent_lifecycle
(
    filing_date      date,
    grant_date       date,
    expiration_date  date,
    status           VARCHAR(255) NOT NULL,
    last_computed_at TIMESTAMP    NOT NULL,
    user_id          VARCHAR(255) NOT NULL,
    patent_id        VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_patent_lifecycle PRIMARY KEY (user_id, patent_id)
);