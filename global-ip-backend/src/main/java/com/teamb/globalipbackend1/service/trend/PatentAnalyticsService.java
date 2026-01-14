package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.external.trendsApi.dto.request.*;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;
import com.teamb.globalipbackend1.model.trend.AnalyticsReport;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface PatentAnalyticsService {


    List<FilingTrendDto> getFilingTrends();
    List<GrantTrendDto> getGrantTrends();
    List<TechnologyTrendDto> getTopTechnologies(int limit);
    Map<String, Object> getComprehensiveDashboard(int year);
    AnalyticsReport generateAndSaveReport(String reportName, int year);


    Map<String, List<AssigneeActivityDto>> getInnovationVelocityForAssignees(
            List<String> assignees, int yearStart, int yearEnd);
    List<TechnologyCrossoverDto> analyzeTechnologyCrossovers(
            TechnologyCrossoverRequest request);
    void scheduleReportGeneration(String cronExpression);
    List<AnalyticsReport> getAllReports();

    List<GeographicTrendDto> getTopCountries(LocalDate startDate, int limit);
    List<CitationTrendDto> getTopCitedPatents(int limit);
    List<TimeToGrantDto> getTimeToGrantTrend();
    List<PatentTypeDto> getPatentTypeDistribution();
    List<ClaimComplexityDto> getClaimComplexityTrend();
    List<AssigneeTrendDto> getTopAssignees(int limit);
    List<CitationMetricDto> getTopCitingPatents(int limit);
    List<TechnologyEvolutionDto> getTechnologyEvolution();


}