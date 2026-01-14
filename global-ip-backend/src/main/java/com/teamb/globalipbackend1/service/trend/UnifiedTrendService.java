package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedYearTrendDto;

import java.util.List;

public interface UnifiedTrendService {

    List<UnifiedYearTrendDto> getUnifiedFilingTrend();

    List<UnifiedCountryTrendDto> getUnifiedCountryTrend();
}
