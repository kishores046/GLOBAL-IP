package com.teamb.globalipbackend1.controller.search;



import com.teamb.globalipbackend1.dto.search.GlobalSearchRequest;
import com.teamb.globalipbackend1.dto.search.UnifiedSearchResponse;
import com.teamb.globalipbackend1.service.search.SearchActivityService;
import com.teamb.globalipbackend1.service.patent.search.UnifiedSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Search", description = "Unified patent and trademark search APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UnifiedSearchController {

    private final UnifiedSearchService unifiedSearchService;
    private final SearchActivityService searchActivityService;

    /**
     * Unified searchByKeyword across patents + trademarks
     */
    @Operation(
            summary = "Unified keyword search",
            description = "Performs keyword-based search across patents and trademarks.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Search results returned",
                            content = @Content(schema = @Schema(implementation = UnifiedSearchResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid request"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
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

            searchActivityService.incrementSearchCount("SIMPLE");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Unified searchByKeyword failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(
            summary = "Advanced search",
            description = "Performs advanced filtered search (admin and analyst only).",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Advanced search results",
                            content = @Content(schema = @Schema(implementation = UnifiedSearchResponse.class))
                    ),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )

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
            searchActivityService.incrementSearchCount("ADVANCED");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Unified searchByKeyword failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }



}
