package com.teamb.globalipbackend1.external.trendsApi.client;

import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;

import java.util.List;

public interface EpoTrendClient {

    List<EpoYearCountDto> getFilingTrend();

    List<EpoCountryTrendDto> getCountryDistribution();

    List<EpoTechnologyTrendDto> getTopTechnologies();

    List<EpoAssigneeTrendDto> getTopAssignees();

    List<EpoFamilyTrendDto> getFamilySizeTrend();
}
