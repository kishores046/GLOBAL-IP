CREATE TABLE international_class_entity
(
    id           BIGINT AUTO_INCREMENT NOT NULL,
    class_code   VARCHAR(255)          NULL,
    trademark_id VARCHAR(255)          NULL,
    CONSTRAINT pk_internationalclassentity PRIMARY KEY (id)
);

ALTER TABLE international_class_entity
    ADD CONSTRAINT FK_INTERNATIONALCLASSENTITY_ON_TRADEMARK FOREIGN KEY (trademark_id) REFERENCES trademark (id);