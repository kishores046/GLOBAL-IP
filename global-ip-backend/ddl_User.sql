CREATE TABLE user_role (
                           user_id VARCHAR(50) NOT NULL,
                           role_id VARCHAR(50) NOT NULL,

                           PRIMARY KEY (user_id, role_id),

                           CONSTRAINT fk_user_role_user
                               FOREIGN KEY (user_id)
                                   REFERENCES users(user_id)
                                   ON DELETE CASCADE,

                           CONSTRAINT fk_user_role_role
                               FOREIGN KEY (role_id)
                                   REFERENCES roles(role_id)
);

CREATE TABLE user_role
(
    role_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_role PRIMARY KEY (role_id, user_id)
);

CREATE TABLE users

ALTER TABLE user_role
    ADD CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE user_role
    ADD CONSTRAINT fk_user_role_userR5qzVu FOREIGN KEY (role_id) REFERENCES roles (role_id);

Alter table users add column  phone_number VARCHAR(255);
Alter table users add column organisation VARCHAR(255);
CREATE TABLE user_role
(
    role_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_role PRIMARY KEY (role_id, user_id)
);

CREATE TABLE users
(
    user_id      VARCHAR(255)                NOT NULL,
    username     VARCHAR(255)                NOT NULL,
    email        VARCHAR(255)                NOT NULL,
    password     VARCHAR(255),
    phone_number VARCHAR(255),
    location     VARCHAR(255),
    company      VARCHAR(255),
    position     VARCHAR(255),
    bio          VARCHAR(255),
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

ALTER TABLE user_role
    ADD CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE user_role
    ADD CONSTRAINT fk_user_role_useryUvYwi FOREIGN KEY (role_id) REFERENCES roles (role_id);

Alter table users add column      bio          VARCHAR(255);


