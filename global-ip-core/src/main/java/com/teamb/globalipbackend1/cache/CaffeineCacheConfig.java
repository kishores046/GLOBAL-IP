package com.teamb.globalipbackend1.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.NonNull;
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


        CaffeineCache patentSearch =
                build(CacheNames.PATENT_SEARCH, 5_000, Duration.ofMinutes(15));

        CaffeineCache patentSnapshot =
                build(CacheNames.PATENT_SNAPSHOT, 10_000, Duration.ofHours(6));

        CaffeineCache trademarkSearch =
                build(CacheNames.TRADEMARK_SEARCH, 5_000, Duration.ofMinutes(15));

        CaffeineCache trademarkSnapshot =
                build(CacheNames.TRADEMARK_SNAPSHOT, 10_000, Duration.ofHours(6));


        CaffeineCache citationNetwork =
                build("citationNetwork", 500, Duration.ofHours(24));

        CaffeineCache patentBasicInfo =
                build("patentBasicInfo", 2_000, Duration.ofHours(24));

        CaffeineCache backwardCitations =
                build("backwardCitations", 5_000, Duration.ofHours(24));

        CaffeineCache forwardCitations =
                build("forwardCitations", 5_000, Duration.ofHours(24));


        CaffeineCache filingTrends =
                build(CacheNames.FILING_TRENDS, 1_000, Duration.ofMinutes(30));

        CaffeineCache grantTrends =
                build(CacheNames.GRANT_TRENDS, 1_000, Duration.ofMinutes(30));

        CaffeineCache topTechnologies =
                build(CacheNames.TOP_TECHNOLOGIES, 500, Duration.ofMinutes(30));

        CaffeineCache topAssignees =
                build(CacheNames.TOP_ASSIGNEES, 500, Duration.ofMinutes(30));

        CaffeineCache technologyEvolution =
                build(CacheNames.TECHNOLOGY_EVOLUTION, 1_000, Duration.ofHours(1));

        CaffeineCache topCitedPatents =
                build(CacheNames.TOP_CITED_PATENTS, 500, Duration.ofMinutes(30));

        CaffeineCache topCitingPatents =
                build(CacheNames.TOP_CITING_PATENTS, 500, Duration.ofMinutes(30));

        CaffeineCache patentTypeDistribution =
                build(CacheNames.PATENT_TYPE_DISTRIBUTION, 100, Duration.ofHours(1));

        CaffeineCache claimComplexityTrend =
                build(CacheNames.CLAIM_COMPLEXITY_TREND, 500, Duration.ofHours(1));

        CaffeineCache timeToGrantTrend =
                build(CacheNames.TIME_TO_GRANT_TREND, 500, Duration.ofHours(1));

        CaffeineCache geoCountryDistribution =
                build(CacheNames.GEO_COUNTRY_DISTRIBUTION, 300, Duration.ofHours(2));


        CaffeineCache unifiedFilingTrend =
                build(CacheNames.UNIFIED_FILING_TREND, 1_000, Duration.ofMinutes(45));

        CaffeineCache unifiedCountryTrend =
                build(CacheNames.UNIFIED_COUNTRY_TREND, 300, Duration.ofHours(2));


        CaffeineCache epoFilingTrend =
                build(CacheNames.EPO_FILING_TREND, 1_000, Duration.ofMinutes(45));

        CaffeineCache epoCountryTrend =
                build(CacheNames.EPO_COUNTRY_TREND, 300, Duration.ofHours(2));

        CaffeineCache epoTopTechnologies =
                build(CacheNames.EPO_TOP_TECHNOLOGIES, 300, Duration.ofMinutes(45));

        CaffeineCache epoTopAssignees =
                build(CacheNames.EPO_TOP_ASSIGNEES, 300, Duration.ofMinutes(45));

        CaffeineCache epoFamilyTrend =
                build(CacheNames.EPO_FAMILY_TREND, 300, Duration.ofHours(2));


        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                patentSearch,
                patentSnapshot,
                trademarkSearch,
                trademarkSnapshot,
                citationNetwork,
                patentBasicInfo,
                backwardCitations,
                forwardCitations,

                filingTrends,
                grantTrends,
                topTechnologies,
                topAssignees,
                technologyEvolution,
                topCitedPatents,
                topCitingPatents,
                patentTypeDistribution,
                claimComplexityTrend,
                timeToGrantTrend,
                geoCountryDistribution,

                unifiedFilingTrend,
                unifiedCountryTrend,

                epoFilingTrend,
                epoCountryTrend,
                epoTopTechnologies,
                epoTopAssignees,
                epoFamilyTrend
        ));

        return manager;
    }

    private CaffeineCache build(String name, long maxSize, Duration ttl) {
        return new CaffeineCache(
                name,
                Caffeine.newBuilder()
                        .maximumSize(maxSize)
                        .expireAfterWrite(ttl)
                        .recordStats()
                        .build()
        );
    }

    /**
     * JWT blacklist cache
     * Used ONLY for token revocation
     */
    @Bean
    public com.github.benmanes.caffeine.cache.Cache<@NonNull String, Boolean>
    tokenBlacklistCache() {

        return Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(10_000)
                .recordStats()
                .build();
    }

}
