package com.teamb.globalip.patenttrendsservice.service;

import com.teamb.globalip.patenttrendsservice.dto.*;
import com.teamb.globalip.patenttrendsservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Profile("prod")
public class TrendService {

    private final PatentRepository patentRepo;
    private final PatentApplicationRepository appRepo;
    private final PatentCpcRepository cpcRepo;
    private final PatentAssigneeRepository assigneeRepo;
    private final PatentCitationRepository citationRepo;

    @Transactional(readOnly = true)
    public List<FilingTrendDto> filingTrend() {
        return appRepo.filingTrend().stream()
                .map(r -> new FilingTrendDto(
                        ((Number) r[0]).intValue(),
                        ((Number) r[1]).longValue()
                ))
                .filter(dto -> dto.year() >= 1900 && dto.year() <= LocalDate.now().getYear())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GrantTrendDto> grantTrend() {
        return patentRepo.grantTrend().stream()
                .map(r -> new GrantTrendDto(
                        ((Number) r[0]).intValue(),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GeographicTrendDto> topCountries(int limit) {
        return patentRepo.topCountries(limit).stream()
                .map(r -> new GeographicTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TechnologyTrendDto> topTechnologies(int limit) {
        return cpcRepo.topTechnologies(limit).stream()
                .map(r -> new TechnologyTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TechnologyEvolutionDto> technologyEvolution() {
        return cpcRepo.technologyEvolution().stream()
                .map(r -> {
                    // FIX ClassCastException - handle Character type
                    Object sectionObj = r[1];
                    String section = sectionObj instanceof Character
                            ? String.valueOf((Character) sectionObj)
                            : (String) sectionObj;

                    return new TechnologyEvolutionDto(
                            ((Number) r[0]).intValue(),
                            section,
                            ((Number) r[2]).longValue()
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TechnologyCrossoverDto> technologyCrossovers(int minCount, int limit) {
        return cpcRepo.technologyCrossovers(minCount, limit).stream()
                .map(r -> new TechnologyCrossoverDto(
                        (String) r[0],
                        (String) r[1],
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssigneeTrendDto> topAssignees(int limit) {
        return assigneeRepo.topAssignees(limit).stream()
                .map(r -> new AssigneeTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssigneeActivityDto> assigneeActivityOverTime(int minPatents) {
        return assigneeRepo.assigneeActivityOverTime(minPatents).stream()
                .map(r -> new AssigneeActivityDto(
                        ((Number) r[0]).intValue(),
                        (String) r[1],
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitationTrendDto> topCitedPatents(int limit) {
        return citationRepo.topCited(limit).stream()
                .map(r -> new CitationTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitationMetricDto> topCitingPatents(int limit) {
        return citationRepo.topCitingPatents(limit).stream()
                .map(r -> new CitationMetricDto(
                        (String) r[0],
                        (String) r[1],
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitationLagDto> citationLagTrend() {
        return citationRepo.citationLagTrend().stream()
                .map(r -> new CitationLagDto(
                        ((Number) r[0]).intValue(),
                        r[1] != null ? ((Number) r[1]).doubleValue() : null
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PatentTypeDto> patentTypeDistribution() {
        return patentRepo.patentTypeDistribution().stream()
                .map(r -> new PatentTypeDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimComplexityDto> claimComplexityTrend() {
        return patentRepo.claimComplexityTrend().stream()
                .map(r -> new ClaimComplexityDto(
                        ((Number) r[0]).intValue(),
                        r[1] != null ? ((Number) r[1]).doubleValue() : null,
                        r[2] != null ? ((Number) r[2]).doubleValue() : null
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TimeToGrantDto> timeToGrantTrend() {
        return appRepo.timeToGrantTrend().stream()
                .map(r -> new TimeToGrantDto(
                        ((Number) r[0]).intValue(),
                        r[1] != null ? ((Number) r[1]).doubleValue() : null
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public YearSummaryDto getYearSummary(int year) {
        Long filings = appRepo.filingsForYear(year);
        Long grants = patentRepo.grantsForYear(year);
        Double avgTimeToGrant = appRepo.avgTimeToGrantForYear(year);

        return new YearSummaryDto(year, filings, grants, avgTimeToGrant);
    }

    @Transactional(readOnly = true)
    public List<AssigneeTechnologyFocusDto> assigneeTechnologyFocus(
            String assigneeName, int limit) {
        return assigneeRepo.assigneeTechnologyFocus(assigneeName, limit).stream()
                .map(r -> new AssigneeTechnologyFocusDto(
                        assigneeName,
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, List<AssigneeActivityDto>> innovationVelocity(
            List<String> assignees, int yearStart, int yearEnd) {

        return assignees.stream()
                .collect(Collectors.toMap(
                        assignee -> assignee,
                        assignee -> assigneeRepo.assigneeYearlyActivity(
                                        assignee, yearStart, yearEnd
                                ).stream()
                                .map(r -> new AssigneeActivityDto(
                                        ((Number) r[0]).intValue(),
                                        assignee,
                                        ((Number) r[1]).longValue()
                                ))
                                .toList()
                ));
    }
}