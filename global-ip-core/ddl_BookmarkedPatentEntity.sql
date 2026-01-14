CREATE TABLE bookmarked_patents
(
    id                 VARCHAR(255)                NOT NULL,
    user_id            VARCHAR(255)                NOT NULL,
    publication_number VARCHAR(255)                NOT NULL,
    source             VARCHAR(255)                NOT NULL,
    created_at         TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_bookmarked_patents PRIMARY KEY (id)
);

ALTER TABLE bookmarked_patents
    ADD CONSTRAINT uc_5e609ff9b24b0b67a69b9c398 UNIQUE (user_id, publication_number);
CREATE TABLE bookmarked_patents
(
    id                 VARCHAR(255) NOT NULL,
    user_id            VARCHAR(255) NOT NULL,
    publication_number VARCHAR(255) NOT NULL,
    source             VARCHAR(255) NOT NULL,
    created_at         TIMESTAMP    NOT NULL,
    CONSTRAINT pk_bookmarked_patents PRIMARY KEY (id)
);

ALTER TABLE bookmarked_patents
    ADD CONSTRAINT uc_5e609ff9b24b0b67a69b9c398 UNIQUE (user_id, publication_number);
CREATE TABLE bookmarked_patents
(
    id                 VARCHAR(255) NOT NULL,
    user_id            VARCHAR(255) NOT NULL,
    publication_number VARCHAR(255) NOT NULL,
    source             VARCHAR(255) NOT NULL,
    created_at         TIMESTAMP    NOT NULL,
    CONSTRAINT pk_bookmarked_patents PRIMARY KEY (id)
);

ALTER TABLE bookmarked_patents
    ADD CONSTRAINT uc_5e609ff9b24b0b67a69b9c398 UNIQUE (user_id, publication_number);