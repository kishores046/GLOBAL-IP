CREATE TABLE role_requests
(
    role_request_id VARCHAR(255)                NOT NULL,
    user_id         VARCHAR(255)                NOT NULL,
    requested_role  VARCHAR(255)                NOT NULL,
    status          VARCHAR(255)                NOT NULL,
    requested_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    reviewed_by     VARCHAR(255),
    reviewed_at     TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_role_requests PRIMARY KEY (role_request_id)
);