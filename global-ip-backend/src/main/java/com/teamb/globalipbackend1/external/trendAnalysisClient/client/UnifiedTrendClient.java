package com.teamb.globalipbackend1.external.trendAnalysisClient.client;

import com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.unified.UnifiedYearTrendDto;

import java.util.List;

public interface UnifiedTrendClient {

    List<UnifiedYearTrendDto> getUnifiedFilingTrend();

    List<UnifiedCountryTrendDto> getUnifiedCountryTrend();
}
