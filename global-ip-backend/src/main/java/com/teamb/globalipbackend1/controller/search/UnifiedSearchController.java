package com.teamb.globalipbackend1.controller.search;



import com.teamb.globalipbackend1.dto.search.GlobalSearchRequest;
import com.teamb.globalipbackend1.dto.search.UnifiedSearchResponse;
import com.teamb.globalipbackend1.service.search.UnifiedSearchService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class UnifiedSearchController {

    private final UnifiedSearchService unifiedSearchService;

    /**
     * Unified searchByKeyword across patents + trademarks
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull UnifiedSearchResponse> searchByKeyword(
            @RequestBody GlobalSearchRequest request) {

        log.info("Received unified searchByKeyword request: {}", request);

        if (request.getKeyword() == null || request.getKeyword().isBlank()) {
            log.warn("Unified searchByKeyword missing keyword");
            return ResponseEntity.badRequest().build();
        }

        try {
            UnifiedSearchResponse response =
                    unifiedSearchService.searchByKeyword(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Unified searchByKeyword failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @PostMapping("/advanced")
    @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
    public ResponseEntity<@NonNull UnifiedSearchResponse> advancedSearch(
            @RequestBody GlobalSearchRequest request) {

        log.info("Received unified advanced search request: {}", request);

        if (request==null) {
            log.warn("Unified advanced search missing query");
            return ResponseEntity.badRequest().build();
        }

        try {
            UnifiedSearchResponse response =
                    unifiedSearchService.searchAdvanced(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Unified searchByKeyword failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }



}
