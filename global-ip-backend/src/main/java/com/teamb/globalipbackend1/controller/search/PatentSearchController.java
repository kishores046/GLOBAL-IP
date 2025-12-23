package com.teamb.globalipbackend1.controller.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.search.UnifiedPatentSearchService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
public class PatentSearchController {

    private final UnifiedPatentSearchService searchService;

    /**
     * Search patents from all sources with optional filters
     *
     * Example request:
     * POST /api/patents/search
     * {
     *   "keyword": "artificial intelligence",
     *   "jurisdiction": "US",
     *   "filingDateFrom": "2020-01-01",
     *   "filingDateTo": "2024-12-31",
     *   "assignee": "Google",
     *   "inventor": "Smith"
     * }
     */

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull List<PatentDocument>> searchPatents(
            @RequestBody PatentSearchFilter filter) {

        log.info("Received patent search request: {}", filter);

        if (filter.getKeyword() == null || filter.getKeyword().isBlank()) {
            log.warn("Search request missing keyword");
            return ResponseEntity.badRequest().build();
        }

        try {
            List<PatentDocument> results = searchService.searchPatents(filter);

            log.info("Returning {} patent results", results.size());

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            log.error("Patent search failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}