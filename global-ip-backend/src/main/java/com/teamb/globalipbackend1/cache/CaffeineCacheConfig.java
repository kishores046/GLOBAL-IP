package com.teamb.globalipbackend1.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.teamb.globalipbackend1.cache.CacheNames;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
public class CaffeineCacheConfig {

    @Bean
    public CacheManager cacheManager() {


        CaffeineCache patentSearch =
                new CaffeineCache(
                        CacheNames.PATENT_SEARCH,
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(Duration.ofMinutes(15))
                                .recordStats()
                                .build()
                );


        CaffeineCache patentSnapshot =
                new CaffeineCache(
                        CacheNames.PATENT_SNAPSHOT,
                        Caffeine.newBuilder()
                                .maximumSize(10_000)
                                .expireAfterWrite(Duration.ofHours(6))
                                .recordStats()
                                .build()
                );

        // 🔹 Trademark search cache
        CaffeineCache trademarkSearch =
                new CaffeineCache(
                        CacheNames.TRADEMARK_SEARCH,
                        Caffeine.newBuilder()
                                .maximumSize(5_000)
                                .expireAfterWrite(Duration.ofMinutes(15))
                                .recordStats()
                                .build()
                );

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                patentSearch,
                patentSnapshot,
                trademarkSearch
        ));

        return manager;
    }
}
