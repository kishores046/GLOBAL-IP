package com.teamb.globalip.patenttrendsservice.service;

import com.teamb.globalip.patenttrendsservice.dto.FilingTrendDto;
import com.teamb.globalip.patenttrendsservice.dto.GeographicTrendDto;
import com.teamb.globalip.patenttrendsservice.dto.epo.EpoCountryTrendDto;
import com.teamb.globalip.patenttrendsservice.dto.epo.EpoYearCountDto;
import com.teamb.globalip.patenttrendsservice.dto.unified.UnifiedCountryTrendDto;
import com.teamb.globalip.patenttrendsservice.dto.unified.UnifiedYearTrendDto;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Profile("prod")
public class UnifiedTrendService {

    private final TrendService patentsViewService;
    private final EpoTrendService epoService;

    private final Executor executor = Executors.newFixedThreadPool(4);



    public List<UnifiedYearTrendDto> unifiedFilingTrend() {

        CompletableFuture<List<FilingTrendDto>> pvFuture =
                CompletableFuture.supplyAsync(
                        patentsViewService::filingTrend, executor
                );

        CompletableFuture<List<EpoYearCountDto>> epoFuture =
                CompletableFuture.supplyAsync(
                        epoService::filingTrend, executor
                );

        CompletableFuture.allOf(pvFuture, epoFuture).join();

        Map<Integer, Long> pvMap = pvFuture.join().stream()
                .collect(Collectors.toMap(
                        FilingTrendDto::year,
                        FilingTrendDto::filings
                ));

        Map<Integer, Long> epoMap = epoFuture.join().stream()
                .collect(Collectors.toMap(
                        EpoYearCountDto::year,
                        EpoYearCountDto::count
                ));

        Set<Integer> years = new HashSet<>();
        years.addAll(pvMap.keySet());
        years.addAll(epoMap.keySet());

        return years.stream()
                .sorted()
                .map(y -> new UnifiedYearTrendDto(
                        y,
                        pvMap.getOrDefault(y, 0L),
                        epoMap.getOrDefault(y, 0L)
                ))
                .toList();
    }



    public List<UnifiedCountryTrendDto> unifiedCountryTrend() {

        CompletableFuture<List<GeographicTrendDto>> pvFuture =
                CompletableFuture.supplyAsync(
                        () -> patentsViewService.topCountries(200),
                        executor
                );

        CompletableFuture<List<EpoCountryTrendDto>> epoFuture =
                CompletableFuture.supplyAsync(
                        epoService::countryDistribution,
                        executor
                );

        CompletableFuture.allOf(pvFuture, epoFuture).join();

        Map<String, Long> pvMap = pvFuture.join().stream()
                .collect(Collectors.toMap(
                        GeographicTrendDto::country,
                        GeographicTrendDto::patentCount
                ));

        Map<String, Long> epoMap = epoFuture.join().stream()
                .collect(Collectors.toMap(
                        EpoCountryTrendDto::country,
                        EpoCountryTrendDto::patentCount
                ));

        Set<String> countries = new HashSet<>();
        countries.addAll(pvMap.keySet());
        countries.addAll(epoMap.keySet());

        return countries.stream()
                .sorted()
                .map(c -> new UnifiedCountryTrendDto(
                        c,
                        pvMap.getOrDefault(c, 0L),
                        epoMap.getOrDefault(c, 0L)
                ))
                .toList();
    }
}