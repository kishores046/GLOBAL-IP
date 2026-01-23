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

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

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

        List<CompletableFuture<List<PatentDocument>>> futures =
                providers.stream()
                        .filter(p -> p.supportsJurisdiction(filter.getJurisdiction()))
                        .map(p -> CompletableFuture.supplyAsync(
                                () -> p.searchByKeyword(filter),
                                patentSearchExecutor
                        ).exceptionally(ex -> {
                            log.error("{} search failed", p.getSource(), ex);
                            return List.of();
                        }))
                        .toList();

        return collectAndFilter(filter, futures);
    }

    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {

        List<CompletableFuture<List<PatentDocument>>> futures =
                providers.stream()
                        .filter(p -> p.supportsJurisdiction(filter.getJurisdiction()))
                        .map(p -> CompletableFuture.supplyAsync(
                                () -> p.searchAdvanced(filter),
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

        List<PatentDocument> filtered =
                filterService.applyFilters(all, filter);

        filtered.forEach(snapshotCacheService::logPatents);
        return filtered;
    }
}