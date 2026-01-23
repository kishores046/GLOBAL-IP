package com.teamb.globalipbackend1.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.teamb.globalipbackend1.security.BlacklistedToken;
import com.teamb.globalipbackend1.security.BlacklistedTokenRepository;
import com.teamb.globalipbackend1.security.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final Cache<String, Boolean> tokenBlacklistCache;
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtUtil jwtUtil;

    /**
     * Blacklist a token (stores in both cache and DB)
     */
    @Transactional
    public void blacklistToken(String token, String userEmail) {

        tokenBlacklistCache.put(token, Boolean.TRUE);


        try {
            String tokenWithoutBearer = token.startsWith("Bearer ") ? token.substring(7) : token;
            Date expiration = jwtUtil.extractExpiration(tokenWithoutBearer);
            LocalDateTime expiresAt = expiration.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // Save to database for persistence
            BlacklistedToken blacklistedToken = new BlacklistedToken(
                    tokenWithoutBearer,
                    expiresAt,
                    userEmail
            );
            blacklistedTokenRepository.save(blacklistedToken);

            log.info("Token blacklisted for user: {}. Cache size: {}",
                    userEmail, tokenBlacklistCache.estimatedSize());
        } catch (Exception e) {
            log.error("Error blacklisting token: {}", e.getMessage());
        }
    }

    /**
     * Check if token is blacklisted (checks cache first, then DB)
     */
    public boolean isBlacklisted(String token) {
        String tokenWithoutBearer = token.startsWith("Bearer ") ? token.substring(7) : token;

        // Check cache first (fast)
        Boolean cachedResult = tokenBlacklistCache.getIfPresent(tokenWithoutBearer);
        if (cachedResult != null && cachedResult) {
            return true;
        }

        // Check database (slower, but persistent)
        boolean isBlacklisted = blacklistedTokenRepository.existsByToken(tokenWithoutBearer);

        // Update cache if found in DB
        if (isBlacklisted) {
            tokenBlacklistCache.put(tokenWithoutBearer, Boolean.TRUE);
        }

        return isBlacklisted;
    }

    /**
     * Clean up expired tokens from database every hour
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        blacklistedTokenRepository.deleteExpiredTokens(now);
        log.info("Cleaned up expired blacklisted tokens");
    }

    /**
     * Get cache statistics
     */
    public String getCacheStats() {
        return String.format(
                "Cache Stats - Size: %d, DB Count: %d, Hits: %d, Misses: %d",
                tokenBlacklistCache.estimatedSize(),
                blacklistedTokenRepository.count(),
                tokenBlacklistCache.stats().hitCount(),
                tokenBlacklistCache.stats().missCount()
        );
    }
}