package com.teamb.globalipbackend1.service.patent.search;

import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.patent.detail.PatentSnapshotCacheService;
import com.teamb.globalipbackend1.service.patent.search.provider.PatentSearchProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

/**
 * Unified service that searches patents from multiple sources (EPO, PatentsView)
 * using parallel execution and applies common filtering logic
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UnifiedPatentSearchService {

    private final List<PatentSearchProvider> providers;
    private final PatentFilterService filterService;
    private final PatentSnapshotCacheService snapshotCacheService;
    private final Executor patentSearchExecutor;

    @Cacheable(
            cacheNames = CacheNames.PATENT_SEARCH,
            key = "T(java.util.Objects).hash("
                    + "#filter.keyword,"
                    + "#filter.jurisdiction,"
                    + "#filter.filingDateFrom,"
                    + "#filter.filingDateTo,"
                    + "#filter.assignee,"
                    + "#filter.inventor)"
    )
    public List<PatentDocument> searchByKeyword(PatentSearchFilter filter) {
        log.info("=== UNIFIED PATENT SEARCH - KEYWORD ===");
        log.info("Filter: {}", filter);
        log.info("Total providers available: {}", providers.size());

        // Filter providers that support this jurisdiction
        List<PatentSearchProvider> selectedProviders = providers.stream()
                .filter(p -> {
                    boolean supports = p.supportsJurisdiction(filter.getJurisdiction());
                    log.info("Provider {} supports jurisdiction '{}': {}",
                            p.getSource(), filter.getJurisdiction(), supports);
                    return supports;
                })
                .toList();

        log.info("Selected {} providers: {}",
                selectedProviders.size(),
                selectedProviders.stream().map(PatentSearchProvider::getSource).collect(Collectors.joining(", ")));

        if (selectedProviders.isEmpty()) {
            log.warn("No providers selected for jurisdiction: {}", filter.getJurisdiction());
            return List.of();
        }

        List<CompletableFuture<List<PatentDocument>>> futures =
                selectedProviders.stream()
                        .map(p -> CompletableFuture.supplyAsync(
                                () -> {
                                    log.info("Starting {} search", p.getSource());
                                    List<PatentDocument> results = p.searchByKeyword(filter);
                                    log.info("{} returned {} results", p.getSource(), results.size());
                                    return results;
                                },
                                patentSearchExecutor
                        ).exceptionally(ex -> {
                            log.error("{} search failed", p.getSource(), ex);
                            return List.of();
                        }))
                        .toList();

        return collectAndFilter(filter, futures);
    }

    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {
        log.info("=== UNIFIED PATENT SEARCH - ADVANCED ===");
        log.info("Filter: {}", filter);
        log.info("Total providers available: {}", providers.size());

        // Filter providers that support this jurisdiction
        List<PatentSearchProvider> selectedProviders = providers.stream()
                .filter(p -> {
                    boolean supports = p.supportsJurisdiction(filter.getJurisdiction());
                    log.info("Provider {} supports jurisdiction '{}': {}",
                            p.getSource(), filter.getJurisdiction(), supports);
                    return supports;
                })
                .toList();

        log.info("Selected {} providers: {}",
                selectedProviders.size(),
                selectedProviders.stream().map(PatentSearchProvider::getSource).collect(Collectors.joining(", ")));

        if (selectedProviders.isEmpty()) {
            log.warn("No providers selected for jurisdiction: {}", filter.getJurisdiction());
            return List.of();
        }

        List<CompletableFuture<List<PatentDocument>>> futures =
                selectedProviders.stream()
                        .map(p -> CompletableFuture.supplyAsync(
                                () -> {
                                    log.info("Starting {} advanced search", p.getSource());
                                    List<PatentDocument> results = p.searchAdvanced(filter);
                                    log.info("{} returned {} results", p.getSource(), results.size());
                                    return results;
                                },
                                patentSearchExecutor
                        ).exceptionally(ex -> {
                            log.error("{} advanced search failed", p.getSource(), ex);
                            return List.of();
                        }))
                        .toList();

        return collectAndFilter(filter, futures);
    }

    private List<PatentDocument> collectAndFilter(
            PatentSearchFilter filter,
            List<CompletableFuture<List<PatentDocument>>> futures
    ) {
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        List<PatentDocument> all =
                futures.stream()
                        .flatMap(f -> f.join().stream())
                        .toList();

        log.info("Combined results from all providers: {} patents", all.size());

        List<PatentDocument> filtered =
                filterService.applyFilters(all, filter);

        log.info("After applying filters: {} patents remain", filtered.size());

        filtered.forEach(snapshotCacheService::logPatents);

        log.info("=== SEARCH COMPLETE ===");
        return filtered;
    }
}