package com.teamb.globalipbackend1.service.patent.detail;


import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentSnapshotCacheService {

    @Cacheable(
            cacheNames = CacheNames.PATENT_SNAPSHOT,
            key = "#patent.publicationNumber"
    )
    public PatentDocument logPatents(PatentDocument patent) {
        log.debug("Caching patent snapshot: {}", patent.getPublicationNumber());
        return patent;
    }
}