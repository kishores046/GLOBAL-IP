package com.teamb.globalip.patenttrendsservice.service;



import com.teamb.globalip.patenttrendsservice.dto.epo.*;
import com.teamb.globalip.patenttrendsservice.repository.*;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentAssigneeRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentCpcRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentFamilyRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EpoTrendService {

    private final EpoPatentRepository patentRepo;
    private final EpoPatentCpcRepository cpcRepo;
    private final EpoPatentAssigneeRepository assigneeRepo;
    private final EpoPatentFamilyRepository familyRepo;

    public List<EpoYearCountDto> filingTrend() {
        return patentRepo.filingTrend().stream()
                .map(r -> new EpoYearCountDto(
                        ((Number) r[0]).intValue(),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    public List<EpoCountryTrendDto> countryDistribution() {
        return patentRepo.countryDistribution().stream()
                .map(r -> new EpoCountryTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    public List<EpoTechnologyTrendDto> topTechnologies() {
        return cpcRepo.topTechnologies().stream()
                .map(r -> new EpoTechnologyTrendDto(
                        String.valueOf(r[0]),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    public List<EpoAssigneeTrendDto> topAssignees() {
        return assigneeRepo.topAssignees().stream()
                .map(r -> new EpoAssigneeTrendDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }

    public List<EpoFamilyTrendDto> familySizeTrend() {
        return familyRepo.familySizeDistribution().stream()
                .map(r -> new EpoFamilyTrendDto(
                        ((Number) r[0]).intValue(),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }
}
