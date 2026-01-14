package com.teamb.globalipbackend1.service.patent.detail;

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
public class GlobalPatentDetailsService {

    private final PatentsViewDetailsService patentsViewService;
    private final EpoClient epoClient;
    private final PatentSourceResolver resolver;
    private final PatentLifecyclePersistenceService lifecyclePersistenceService;
    private final SecurityUtil securityUtil;

    public GlobalPatentDetailDto fetchGlobalDetail(String publicationNumber) {

        GlobalPatentDetailDto dto;

        if (resolver.isEpoPatent(publicationNumber)) {
            log.info("Routing patent [{}] to EPO OPS", publicationNumber);
            dto = epoClient.fetchGlobalDetail(publicationNumber);
            if (dto == null) return null;


            ApplicationLifecycleDto lifecycle =
                    PatentLifecycleCalculator.compute(
                            publicationNumber,
                            dto.getFilingDate(),
                            dto.getGrantDate(),
                            dto.getExpiryDate(),
                            false
                    );

            dto.setApplicationLifecycleDto(lifecycle);
            dto.setSource("EPO");

        } else {
            log.info("Routing patent [{}] to PatentsView", publicationNumber);
            dto = patentsViewService.fetchGlobalDetail(publicationNumber);
            if (dto == null) return null;
        }


        lifecyclePersistenceService.saveLifecycle(
                securityUtil.getUserId(),
                dto.getApplicationLifecycleDto()
        );

        return dto;
    }
}
