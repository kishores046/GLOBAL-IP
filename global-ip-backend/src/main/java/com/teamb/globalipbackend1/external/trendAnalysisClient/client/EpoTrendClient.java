package com.teamb.globalipbackend1.external.trendAnalysisClient.client;

import com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.epo.*;

import java.util.List;

public interface EpoTrendClient {

    List<EpoYearCountDto> getFilingTrend();

    List<EpoCountryTrendDto> getCountryDistribution();

    List<EpoTechnologyTrendDto> getTopTechnologies();

    List<EpoAssigneeTrendDto> getTopAssignees();

    List<EpoFamilyTrendDto> getFamilySizeTrend();
}
