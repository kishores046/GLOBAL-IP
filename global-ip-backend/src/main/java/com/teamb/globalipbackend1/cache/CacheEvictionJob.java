package com.teamb.globalipbackend1.cache;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CacheEvictionJob {

    @Scheduled(cron = "0 0 * * * *") // every hour
    @CacheEvict(
            cacheNames = {
                    CacheNames.PATENT_SEARCH,
                    CacheNames.TRADEMARK_SEARCH
            },
            allEntries = true
    )
    public void evictSearchCaches() {
        log.info("Search caches evicted by scheduler");
    }
}

