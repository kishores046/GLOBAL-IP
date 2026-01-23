package com.teamb.globalipbackend1.model.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
@Getter
@Setter
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String name;

    private String keyHash;

    private String keyPrefix;

    @Enumerated(EnumType.STRING)
    private ApiKeyStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime lastUsedAt;
}
