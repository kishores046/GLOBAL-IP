package com.teamb.globalipbackend1.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtUtil {

    private final JwtConfig jwtConfig;

    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        long now = System.currentTimeMillis();
        long exp = now + jwtConfig.getExpiration();

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", roles)
                .issuer(jwtConfig.getIssuer())
                .audience().add(jwtConfig.getAudience()).and() // Add audience claim
                .issuedAt(new Date(now))
                .expiration(new Date(exp))
                .id(UUID.randomUUID().toString())
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    public List<String> extractRoles(String token) {
        Claims claims = parseClaims(token);
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List) {
            return ((List<?>) rolesObj).stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = parseClaims(token);
            String username = claims.getSubject();

            // Validate issuer
            String issuer = claims.getIssuer();
            if (!jwtConfig.getIssuer().equals(issuer)) {
                log.warn("Invalid issuer: expected {}, got {}", jwtConfig.getIssuer(), issuer);
                return false;
            }

            Object audClaim = claims.get("aud");

            if (audClaim instanceof String aud) {
                if (!jwtConfig.getAudience().equals(aud)) return false;
            } else if (audClaim instanceof Collection<?> auds) {
                if (!auds.contains(jwtConfig.getAudience())) return false;
            } else {
                return false;
            }

            return username != null
                    && username.equals(userDetails.getUsername())
                    && !isTokenExpired(token);
        } catch (Exception e) {
            log.info("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Claims claims = parseClaims(token);
        Date exp = claims.getExpiration();
        return exp.before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractTokenId(String token) {
        Claims claims = parseClaims(token);
        return claims.getId();
    }


    public Date extractExpiration(String token) {
        Claims claims = parseClaims(token);
        return claims.getExpiration();
    }

}