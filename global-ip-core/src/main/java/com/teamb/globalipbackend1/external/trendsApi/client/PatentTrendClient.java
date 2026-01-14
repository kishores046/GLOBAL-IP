package com.teamb.globalipbackend1.external.trendsApi.client;



import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public interface PatentTrendClient {

    List<FilingTrendDto> getFilingTrend();
    List<GrantTrendDto> getGrantTrend();

    List<TechnologyTrendDto> getTopTechnologies(int limit);
    List<AssigneeTrendDto> getTopAssignees(int limit);

    List<GeographicTrendDto> getTopCountries(LocalDate startDate, int limit);

    List<CitationTrendDto> getTopCitedPatents(int limit);
    List<CitationMetricDto> getTopCitingPatents(int limit);
    List<CitationLagDto> getCitationLagTrend();

    List<TechnologyEvolutionDto> getTechnologyEvolution();
    List<TechnologyCrossoverDto> getTechnologyCrossovers(int minCount, int limit);

    List<PatentTypeDto> getPatentTypeDistribution();
    List<ClaimComplexityDto> getClaimComplexityTrend();
    List<TimeToGrantDto> getTimeToGrantTrend();

    YearSummaryDto getYearSummary(int year);
    List<AssigneeTechnologyFocusDto> getAssigneeTechnologyFocus(
            String assigneeName, int limit);

    Map<String, List<AssigneeActivityDto>> getInnovationVelocity(
            List<String> assignees, int yearStart, int yearEnd);

    CompletableFuture<List<FilingTrendDto>> getFilingTrendAsync();
    CompletableFuture<YearSummaryDto> getYearSummaryAsync(int year);
}
