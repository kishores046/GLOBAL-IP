CREATE TABLE trademark
(
    id                  VARCHAR(255) NOT NULL,
    mark_name           VARCHAR(255) NULL,
    filing_date         date         NULL,
    status_code         VARCHAR(255) NULL,
    drawing_code        VARCHAR(255) NULL,
    standard_characters BIT(1)       NULL,
    CONSTRAINT pk_trademark PRIMARY KEY (id)
);

CREATE TABLE trademark_owner
(
    owner_id     BIGINT       NOT NULL,
    trademark_id VARCHAR(255) NOT NULL
);

ALTER TABLE trademark_owner
    ADD CONSTRAINT fk_traown_on_owner_entity FOREIGN KEY (owner_id) REFERENCES owner_entity (id);

ALTER TABLE trademark_owner
    ADD CONSTRAINT fk_traown_on_trade_mark_entity FOREIGN KEY (trademark_id) REFERENCES trademark (id);
CREATE TABLE trademark
(
    id                  VARCHAR(255) NOT NULL,
    mark_name           VARCHAR(255) NULL,
    filing_date         date         NULL,
    status_code         VARCHAR(255) NULL,
    drawing_code        VARCHAR(255) NULL,
    standard_characters BIT(1)       NULL,
    CONSTRAINT pk_trademark PRIMARY KEY (id)
);

CREATE TABLE trademark_owner
(
    owner_id     BIGINT       NOT NULL,
    trademark_id VARCHAR(255) NOT NULL
);

ALTER TABLE trademark_owner
    ADD CONSTRAINT fk_traown_on_owner_entity FOREIGN KEY (owner_id) REFERENCES owner_entity (id);

ALTER TABLE trademark_owner
    ADD CONSTRAINT fk_traown_on_trade_mark_entity FOREIGN KEY (trademark_id) REFERENCES trademark (id);