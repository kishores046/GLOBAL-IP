package com.teamb.globalipbackend1.service.trend;

import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.external.trendsApi.client.PatentTrendClient;
import com.teamb.globalipbackend1.external.trendsApi.dto.request.TechnologyCrossoverRequest;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;
import com.teamb.globalipbackend1.model.trend.AnalyticsReport;
import com.teamb.globalipbackend1.repository.trend.AnalyticsReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentAnalyticsServiceImpl implements PatentAnalyticsService {

    private final PatentTrendClient patentClient;
    private final AnalyticsReportRepository reportRepository;



    @Override
    @Cacheable(cacheNames = "filingTrends")
    public List<FilingTrendDto> getFilingTrends() {
        log.info("Fetching filing trends");
        return patentClient.getFilingTrend();
    }

    @Override
    @Cacheable(cacheNames = CacheNames.GRANT_TRENDS)
    public List<GrantTrendDto> getGrantTrends() {
        log.info("Fetching grant trends");
        return patentClient.getGrantTrend();
    }

    @Override

    public List<TechnologyTrendDto> getTopTechnologies(int limit) {
        log.info("Fetching top {} technologies", limit);
        return patentClient.getTopTechnologies(limit);
    }



    @Override
    public Map<String, List<AssigneeActivityDto>> getInnovationVelocityForAssignees(
            List<String> assignees, int yearStart, int yearEnd) {
        log.info("Analyzing innovation velocity for {} assignees",
                assignees.size());
        return patentClient.getInnovationVelocity(  assignees, yearStart,  yearEnd);
    }

    @Override
    public List<TechnologyCrossoverDto> analyzeTechnologyCrossovers(
            TechnologyCrossoverRequest request) {
        log.info("Analyzing technology crossovers (minCount={}, limit={})",
                request.minCount(), request.limit());
        return patentClient.getTechnologyCrossovers(request.minCount(),request.limit());
    }

    @Override
    public void scheduleReportGeneration(String cronExpression) {
        log.info("Scheduling report generation with cron: {}", cronExpression);
    }

    @Override
    public List<GeographicTrendDto> getTopCountries(LocalDate startDate, int limit) {
        return patentClient.getTopCountries(startDate, limit);
    }

    @Override
    @Cacheable(cacheNames = "topCitedPatents", key = "#limit")
    public List<CitationTrendDto> getTopCitedPatents(int limit) {
        return patentClient.getTopCitedPatents(limit);
    }

    @Override
    @Cacheable(cacheNames = "timeToGrantTrend")
    public List<TimeToGrantDto> getTimeToGrantTrend() {
        return patentClient.getTimeToGrantTrend();
    }

    @Override
    @Cacheable(cacheNames = "patentTypeDistribution")
    public List<PatentTypeDto> getPatentTypeDistribution() {
        return patentClient.getPatentTypeDistribution();
    }

    @Override
    @Cacheable(cacheNames = "claimComplexityTrend")
    public List<ClaimComplexityDto> getClaimComplexityTrend() {
        return patentClient.getClaimComplexityTrend();
    }

    @Override
    @Cacheable(
            cacheNames = "topAssignees",
            key = "#limit"
    )
    public List<AssigneeTrendDto> getTopAssignees(int limit) {
        log.info("Fetching top {} assignees", limit);
        return patentClient.getTopAssignees(limit);
    }

    @Override
    @Cacheable(cacheNames = "topCitingPatents", key = "#limit")
    public List<CitationMetricDto> getTopCitingPatents(int limit) {
        log.info("Fetching top {} citing patents", limit);
        return patentClient.getTopCitingPatents(limit);
    }


    @Override
    @Cacheable(cacheNames = CacheNames.TECHNOLOGY_EVOLUTION)
    public List<TechnologyEvolutionDto> getTechnologyEvolution() {
        return patentClient.getTechnologyEvolution();
    }

}