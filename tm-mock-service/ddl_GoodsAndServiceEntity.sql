CREATE TABLE goods_and_service_entity
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    `description` LONGTEXT              NULL,
    trademark_id  VARCHAR(255)          NULL,
    CONSTRAINT pk_goodsandserviceentity PRIMARY KEY (id)
);

ALTER TABLE goods_and_service_entity
    ADD CONSTRAINT FK_GOODSANDSERVICEENTITY_ON_TRADEMARK FOREIGN KEY (trademark_id) REFERENCES trademark (id);