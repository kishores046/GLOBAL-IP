CREATE TABLE owner_entity
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    owner_name    VARCHAR(255)          NULL,
    owner_country VARCHAR(255)          NULL,
    owner_state   VARCHAR(255)          NULL,
    CONSTRAINT pk_ownerentity PRIMARY KEY (id)
);