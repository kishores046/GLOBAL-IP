CREATE TABLE graph_view_event
(
    id        BIGINT NOT NULL,
    user_id   VARCHAR(255),
    graph_key VARCHAR(255),
    viewed_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_graphviewevent PRIMARY KEY (id)
);