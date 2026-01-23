package com.teamb.globalipbackend1.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklisted_tokens", indexes = {
        @Index(name = "idx_token", columnList = "token"),
        @Index(name = "idx_expiry", columnList = "expires_at")
})
@Getter
@Setter
@NoArgsConstructor
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(nullable = false, name = "blacklisted_at")
    private LocalDateTime blacklistedAt;

    @Column(nullable = false, name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "user_email")
    private String userEmail;

    public BlacklistedToken(String token, LocalDateTime expiresAt, String userEmail) {
        this.token = token;
        this.blacklistedAt = LocalDateTime.now();
        this.expiresAt = expiresAt;
        this.userEmail = userEmail;
    }
}