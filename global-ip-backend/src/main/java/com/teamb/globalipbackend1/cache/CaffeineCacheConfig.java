package com.teamb.globalipbackend1.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Configuration
@EnableCaching
public class CaffeineCacheConfig {

    @Bean
    public CacheManager cacheManager() {

        // 🔍 Patent search results (short-lived)
        CaffeineCache patentSearch =
                new CaffeineCache(
                        CacheNames.PATENT_SEARCH,
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(Duration.ofMinutes(15))
                                .recordStats()
                                .build()
                );

        // 📄 Patent snapshot (detail page data)
        CaffeineCache patentSnapshot =
                new CaffeineCache(
                        CacheNames.PATENT_SNAPSHOT,
                        Caffeine.newBuilder()
                                .maximumSize(10_000)
                                .expireAfterWrite(Duration.ofHours(6))
                                .recordStats()
                                .removalListener((key, value, cause) ->
                                        log.info("Patent snapshot {} evicted due to {}", key, cause))
                                .build()
                );

        // 🔖 Trademark search
        CaffeineCache trademarkSearch =
                new CaffeineCache(
                        CacheNames.TRADEMARK_SEARCH,
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(Duration.ofMinutes(15))
                                .recordStats()
                                .build()
                );

        // 📄 Trademark snapshot
        CaffeineCache trademarkSnapshot =
                new CaffeineCache(
                        CacheNames.TRADEMARK_SNAPSHOT,
                        Caffeine.newBuilder()
                                .maximumSize(10_000)
                                .expireAfterWrite(Duration.ofHours(6))
                                .recordStats()
                                .build()
                );

        // 🧠 Citation network (expensive, long-lived)
        CaffeineCache citationNetwork =
                new CaffeineCache(
                        "citationNetwork",
                        Caffeine.newBuilder()
                                .maximumSize(500)
                                .expireAfterWrite(24, TimeUnit.HOURS)
                                .recordStats()
                                .build()
                );

        // 📚 Citation building blocks
        CaffeineCache patentBasicInfo =
                new CaffeineCache(
                        "patentBasicInfo",
                        Caffeine.newBuilder()
                                .maximumSize(2_000)
                                .expireAfterWrite(24, TimeUnit.HOURS)
                                .recordStats()
                                .build()
                );

        CaffeineCache backwardCitations =
                new CaffeineCache(
                        "backwardCitations",
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(24, TimeUnit.HOURS)
                                .recordStats()
                                .build()
                );

        CaffeineCache forwardCitations =
                new CaffeineCache(
                        "forwardCitations",
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(24, TimeUnit.HOURS)
                                .recordStats()
                                .build()
                );

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                patentSearch,
                patentSnapshot,
                trademarkSearch,
                trademarkSnapshot,
                citationNetwork,
                patentBasicInfo,
                backwardCitations,
                forwardCitations
        ));

        return manager;
    }
}
