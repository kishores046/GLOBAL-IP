package com.teamb.globalipbackend1.service.patent.detail;


import com.teamb.globalipbackend1.dto.epo.EpoPatentDetailDto;
import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.lifecycle.PatentLifecycleCalculator;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EpoDetailsService {

    private final EpoClient epoClient;
    private final PatentLifecyclePersistenceService lifecyclePersistenceService;
    private final SecurityUtil securityUtil;

    /**
     * Fetch EPO patent details from API
     */
    public EpoPatentDetailDto fetchPatentDetail(String publicationNumber) {
        try {
            log.info("Fetching EPO patent detail: {}", publicationNumber);

            // Fetch from EPO API
            GlobalPatentDetailDto globalDetail = epoClient.fetchGlobalDetail(publicationNumber);

            if (globalDetail == null) {
                log.warn("EPO API returned null for: {}", publicationNumber);
                return null;
            }

            // Convert to EPO-specific DTO
            EpoPatentDetailDto dto = new EpoPatentDetailDto();
            dto.setPublicationNumber(globalDetail.getPublicationNumber());
            dto.setJurisdiction(globalDetail.getJurisdiction());
            dto.setWipoKind(globalDetail.getWipoKind());
            dto.setTitle(globalDetail.getTitle());
            dto.setAbstractText(globalDetail.getAbstractText());
            dto.setFilingDate(globalDetail.getFilingDate());
            dto.setGrantDate(globalDetail.getGrantDate());
            dto.setAssignees(globalDetail.getAssignees());
            dto.setInventors(globalDetail.getInventors());
            dto.setIpcClasses(globalDetail.getIpcClasses());
            dto.setCpcClasses(globalDetail.getCpcClasses());
            dto.setTimesCited(globalDetail.getTimesCited());
            dto.setTotalCitations(globalDetail.getTotalCitations());

            // Calculate lifecycle
            ApplicationLifecycleDto lifecycle = PatentLifecycleCalculator.compute(
                    publicationNumber,
                    globalDetail.getFilingDate(),
                    globalDetail.getGrantDate(),
                    null, // EPO doesn't provide expiration date directly
                    false
            );

            dto.setLifecycle(lifecycle);

            log.info("Successfully fetched EPO patent: {}, status: {}",
                    publicationNumber, lifecycle.status());

            return dto;

        } catch (Exception e) {
            log.error("Failed to fetch EPO patent detail: {}", publicationNumber, e);
            return null;
        }
    }

    /**
     * Fetch EPO patent detail with user context (saves lifecycle)
     */
    public EpoPatentDetailDto fetchGlobalDetail(String publicationNumber) {
        EpoPatentDetailDto detail = fetchPatentDetail(publicationNumber);

        if (detail == null) {
            return null;
        }

        // Save lifecycle for current user
        String userId = securityUtil.getUserId();

        lifecyclePersistenceService.saveLifecycle(
                userId,
                detail.getLifecycle()
        );

        log.info("Saved lifecycle for user={}, patent={}", userId, publicationNumber);

        return detail;
    }

    /**
     * Refresh patent data from EPO API (for scheduler)
     */
    public EpoPatentDetailDto refreshPatentData(String publicationNumber) {
        log.debug("Refreshing EPO patent data: {}", publicationNumber);
        return fetchPatentDetail(publicationNumber);
    }
}