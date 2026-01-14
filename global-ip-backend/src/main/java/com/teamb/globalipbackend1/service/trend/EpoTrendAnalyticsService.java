package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;

import java.util.List;

public interface EpoTrendAnalyticsService {

    List<EpoYearCountDto> filingTrend();

    List<EpoCountryTrendDto> countryDistribution();

    List<EpoTechnologyTrendDto> topTechnologies();

    List<EpoAssigneeTrendDto> topAssignees();

    List<EpoFamilyTrendDto> familySizeTrend();
}
