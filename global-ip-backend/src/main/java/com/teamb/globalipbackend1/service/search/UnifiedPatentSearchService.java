package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * Search patents from all available sources and apply filters
     */
    public List<PatentDocument> searchPatents(PatentSearchFilter filter) {
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
                    return patentsViewSearchService.searchPatents(filter.getKeyword());
                }, patentSearchExecutor).exceptionally(ex -> {
                    log.error("PatentsView search failed", ex);
                    return List.of();
                })
                        : CompletableFuture.completedFuture(List.of());

        // Wait for both searches to complete
        CompletableFuture.allOf(epoFuture, patentsViewFuture).join();

        List<PatentDocument> allResults = new ArrayList<>();
        allResults.addAll(epoFuture.join());
        allResults.addAll(patentsViewFuture.join());

        log.info("Total results before filtering: {}", allResults.size());

        List<PatentDocument> filteredResults =
                patentFilterService.applyFilters(allResults, filter);

        log.info("Total results after filtering: {}", filteredResults.size());

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
}
