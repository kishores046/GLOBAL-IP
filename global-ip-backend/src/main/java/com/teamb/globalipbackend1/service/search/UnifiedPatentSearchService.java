package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.patent.PatentSnapshotCacheService;
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

    private final EPOPatentSearchService epoSearchService;
    private final PatentsViewSearchService patentsViewSearchService;
    private final PatentFilterService patentFilterService;
    private final Executor patentSearchExecutor;
    private final PatentSnapshotCacheService snapshotCacheService;

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
    public List<PatentDocument> searchPatentsByKeyword(PatentSearchFilter filter) {
        log.info("Starting unified patent search with filter: {}", filter);

        boolean searchEPO = shouldSearchEPO(filter.getJurisdiction());
        boolean searchPatentsView = shouldSearchPatentsView(filter.getJurisdiction());

        CompletableFuture<List<PatentDocument>> epoFuture =
                searchEPO
                        ? CompletableFuture.supplyAsync(() -> {
                    log.info("Searching EPO for keyword: {}", filter.getKeyword());
                    return epoSearchService.searchPatents(filter.getKeyword());
                }, patentSearchExecutor).exceptionally(ex -> {
                    log.error("EPO search failed", ex);
                    return List.of();
                })
                        : CompletableFuture.completedFuture(List.of());

        CompletableFuture<List<PatentDocument>> patentsViewFuture =
                searchPatentsView
                        ? CompletableFuture.supplyAsync(() -> {
                    log.info("Searching PatentsView for keyword: {}", filter.getKeyword());
                    return patentsViewSearchService.searchPatentsByKeyword(filter.getKeyword(), filter);
                }, patentSearchExecutor).exceptionally(ex -> {
                    log.error("PatentsView search failed", ex);
                    return List.of();
                })
                        : CompletableFuture.completedFuture(List.of());

        return getPatentDocuments(filter, patentsViewFuture, epoFuture);
    }

    private List<PatentDocument> getPatentDocuments(
            PatentSearchFilter filter,
            CompletableFuture<List<PatentDocument>> patentsViewFuture,
            CompletableFuture<List<PatentDocument>> epoFuture) {

        CompletableFuture.allOf(patentsViewFuture, epoFuture).join();

        List<PatentDocument> allResults = new ArrayList<>();
        allResults.addAll(patentsViewFuture.join());
        allResults.addAll(epoFuture.join());

        log.info("Total results before filtering: {}", allResults.size());


        List<PatentDocument> filteredResults =
                patentFilterService.applyFilters(allResults, filter);

        log.info("Total results after filtering: {}", filteredResults.size());
        filteredResults.forEach(snapshotCacheService::cache);

        return filteredResults;
    }

    private boolean shouldSearchEPO(String jurisdiction) {
        if (jurisdiction == null || jurisdiction.equalsIgnoreCase("ALL")) {
            return true;
        }
        return !jurisdiction.equalsIgnoreCase("US");
    }

    private boolean shouldSearchPatentsView(String jurisdiction) {
        if (jurisdiction == null || jurisdiction.equalsIgnoreCase("ALL")) {
            return true;
        }
        return jurisdiction.equalsIgnoreCase("US");
    }

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
    public List<PatentDocument> searchPatentsAdvanced(PatentSearchFilter filter) {
        log.info("Starting unified patent advanced search with filter: {}", filter);

        boolean searchEPO = shouldSearchEPO(filter.getJurisdiction());
        boolean searchPatentsView = shouldSearchPatentsView(filter.getJurisdiction());

        CompletableFuture<List<PatentDocument>> epoFuture =
                searchEPO
                        ? CompletableFuture.supplyAsync(() -> {
                    log.info("Searching EPO for advanced query: {}", filter.toString());
                    return epoSearchService.searchAdvanced(filter);
                }, patentSearchExecutor).exceptionally(ex -> {
                    log.error("EPO search failed", ex);
                    return List.of();
                })
                        : CompletableFuture.completedFuture(List.of());

        CompletableFuture<List<PatentDocument>> patentsViewFuture =
                searchPatentsView
                        ? CompletableFuture.supplyAsync(() -> {
                    log.info("Searching PatentsView for advanced query: {}", filter);
                    return patentsViewSearchService.advancedSearch(filter);
                }, patentSearchExecutor).exceptionally(ex -> {
                    log.error("PatentsView search failed", ex);
                    return List.of();
                })
                        : CompletableFuture.completedFuture(List.of());

        return getPatentDocuments(filter, patentsViewFuture, epoFuture);
    }
}