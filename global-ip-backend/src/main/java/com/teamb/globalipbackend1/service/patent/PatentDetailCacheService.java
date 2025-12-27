package com.teamb.globalipbackend1.service.patent;

import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.service.search.PatentsViewDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatentDetailCacheService {

    private final EpoClient epoClient;
    private final PatentsViewDetailsService patentsViewDetailService;

    @Cacheable(
            cacheNames = CacheNames.PATENT_DETAIL,
            key = "#publicationNumber",
            unless = "#result == null"  // Don't cache null results
    )
    public GlobalPatentDetailDto getPatentDetailBase(String publicationNumber) {

        log.info("Fetching patent detail for: {}", publicationNumber);

        // Determine if this is a US patent
        boolean isUSPatent = isUSPatent(publicationNumber);

        log.info("Patent {} identified as US patent: {}", publicationNumber, isUSPatent);

        GlobalPatentDetailDto dto = null;

        if (isUSPatent) {
            dto = patentsViewDetailService.fetchGlobalDetail(publicationNumber);
        } else {
            dto = epoClient.fetchGlobalDetail(publicationNumber);
        }

        if (dto == null) {
            log.error("Patent not found in {} : {}",
                    isUSPatent ? "PatentsView" : "EPO",
                    publicationNumber);
            throw new RuntimeException("Patent not found: " + publicationNumber);
        }

        // Set source based on where it came from
        dto.setSource(isUSPatent ? "PatentsView" : "EPO");
        dto.setBookmarked(false);

        log.info("Successfully fetched patent: {} from {}", publicationNumber, dto.getSource());

        return dto;
    }

    /**
     * Determines if a patent number is a US patent
     * Handles formats: "US1234567", "1234567", "US-1234567-B2"
     */
    private boolean isUSPatent(String publicationNumber) {
        if (publicationNumber == null || publicationNumber.isBlank()) {
            return false;
        }

        String normalized = publicationNumber.trim().toUpperCase();

        // Check if it starts with US
        if (normalized.startsWith("US")) {
            return true;
        }

        // Check if it's just digits (assume US patent)
        // US patents are typically 7-8 digits
        if (normalized.matches("^\\d{7,8}$")) {
            return true;
        }

        // If it starts with 2 letters (like EP, WO, KR), it's not US
        if (normalized.matches("^[A-Z]{2}.*")) {
            return false;
        }

        // Default: if purely numeric, assume US
        return normalized.matches("^\\d+$");
    }
}