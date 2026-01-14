package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.external.trendsApi.client.UnifiedTrendClient;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedYearTrendDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UnifiedTrendServiceImpl implements UnifiedTrendService {

    private final UnifiedTrendClient unifiedTrendClient;

    @Override
    @Cacheable(cacheNames = "unifiedFilingTrend")
    public List<UnifiedYearTrendDto> getUnifiedFilingTrend() {
        log.info("[UNIFIED] Fetching unified filing trend");
        return unifiedTrendClient.getUnifiedFilingTrend();
    }

    @Override
    @Cacheable(cacheNames = "unifiedCountryTrend")
    public List<UnifiedCountryTrendDto> getUnifiedCountryTrend() {
        log.info("[UNIFIED] Fetching unified country trend");
        return unifiedTrendClient.getUnifiedCountryTrend();
    }
}
