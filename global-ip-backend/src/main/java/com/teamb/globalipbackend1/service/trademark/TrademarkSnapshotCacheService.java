package com.teamb.globalipbackend1.service.trademark;

import com.teamb.globalipbackend1.cache.CacheNames;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TrademarkSnapshotCacheService {

    @Cacheable(
            cacheNames = CacheNames.TRADEMARK_SNAPSHOT,
            key = "#snapshot.id"
    )
    public TrademarkSnapshot cache(TrademarkSnapshot snapshot) {
        log.debug("Caching trademark snapshot: {}", snapshot.getId());
        return snapshot;
    }
}