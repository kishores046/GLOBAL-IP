package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.external.trendsApi.client.EpoTrendClient;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EpoTrendAnalyticsServiceImpl implements EpoTrendAnalyticsService {

    private final EpoTrendClient epoTrendClient;

    @Override
    @Cacheable(cacheNames = "epoFilingTrend")
    public List<EpoYearCountDto> filingTrend() {
        log.info("[EPO] Filing trend");
        return epoTrendClient.getFilingTrend();
    }

    @Override
    @Cacheable(cacheNames = "epoCountryTrend")
    public List<EpoCountryTrendDto> countryDistribution() {
        log.info("[EPO] Country distribution");
        return epoTrendClient.getCountryDistribution();
    }

    @Override
    @Cacheable(cacheNames = "epoTopTechnologies")
    public List<EpoTechnologyTrendDto> topTechnologies() {
        log.info("[EPO] Top technologies");
        return epoTrendClient.getTopTechnologies();
    }

    @Override
    @Cacheable(cacheNames = "epoTopAssignees")
    public List<EpoAssigneeTrendDto> topAssignees() {
        log.info("[EPO] Top assignees");
        return epoTrendClient.getTopAssignees();
    }

    @Override
    @Cacheable(cacheNames = "epoFamilyTrend")
    public List<EpoFamilyTrendDto> familySizeTrend() {
        log.info("[EPO] Family size trend");
        return epoTrendClient.getFamilySizeTrend();
    }
}
