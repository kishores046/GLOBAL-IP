package com.teamb.globalipbackend1.controller.competitor;

import com.teamb.globalipbackend1.dto.competitor.CompetitorCreateRequest;
import com.teamb.globalipbackend1.dto.competitor.CompetitorDTO;
import com.teamb.globalipbackend1.dto.competitor.CompetitorUpdateRequest;
import com.teamb.globalipbackend1.service.patent.competitor.CompetitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;


/**
 * REST API for managing competitors
 */
@RestController
@RequestMapping("/api/competitors")
@RequiredArgsConstructor
@Slf4j
@Tag(
        name = "Competitors",
        description = "APIs for managing and tracking competitor entities"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
public class CompetitorController {

    private final CompetitorService competitorService;

    @Operation(
            summary = "Create competitor",
            description = "Creates a new competitor entity for tracking and analysis.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Competitor created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid request"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )

    @PostMapping
    public ResponseEntity<@NonNull  CompetitorDTO> createCompetitor(
            @RequestBody CompetitorCreateRequest request) {

        log.info("Creating competitor: {}", request.getCode());
        CompetitorDTO competitor = competitorService.createCompetitor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(competitor);
    }


    @Operation(
            summary = "Update competitor",
            description = "Updates an existing competitor by ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Competitor updated successfully"),
                    @ApiResponse(responseCode = "404", description = "Competitor not found"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )

    @PutMapping("/{id}")
    public ResponseEntity<@NonNull CompetitorDTO> updateCompetitor(
            @PathVariable Long id,
            @RequestBody CompetitorUpdateRequest request) {

        log.info("Updating competitor: {}", id);
        CompetitorDTO competitor = competitorService.updateCompetitor(id, request);
        return ResponseEntity.ok(competitor);
    }

    @Operation(
            summary = "Get competitor by ID",
            description = "Fetches competitor details using the competitor ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Competitor retrieved successfully"),
                    @ApiResponse(responseCode = "404", description = "Competitor not found")
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<@NonNull CompetitorDTO> getCompetitor(@PathVariable Long id) {
        CompetitorDTO competitor = competitorService.getCompetitor(id);
        return ResponseEntity.ok(competitor);
    }

    @Operation(
            summary = "Get competitor by code",
            description = "Fetches competitor details using a unique competitor code.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Competitor retrieved successfully"),
                    @ApiResponse(responseCode = "404", description = "Competitor not found")
            }
    )

    @GetMapping("/code/{code}")
    public ResponseEntity<@NonNull CompetitorDTO> getCompetitorByCode(@PathVariable String code) {
        CompetitorDTO competitor = competitorService.getCompetitorByCode(code);
        return ResponseEntity.ok(competitor);
    }

    @Operation(
            summary = "List competitors",
            description = "Lists competitors. Can optionally return only active competitors.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Competitor list returned successfully")
            }
    )

    @GetMapping
    public ResponseEntity<@NonNull List<CompetitorDTO>> listCompetitors(
            @RequestParam(required = false, defaultValue = "true") boolean activeOnly) {

        List<CompetitorDTO> competitors = activeOnly
                ? competitorService.listActiveCompetitors()
                : competitorService.listAllCompetitors();

        return ResponseEntity.ok(competitors);
    }

    @Operation(
            summary = "Search competitors",
            description = "Search competitors by name or code using a query string.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Search results returned successfully")
            }
    )
    @GetMapping("/search")
    public ResponseEntity<@NonNull List<CompetitorDTO>> searchCompetitors(
            @RequestParam String q) {

        List<CompetitorDTO> competitors = competitorService.searchCompetitors(q);
        return ResponseEntity.ok(competitors);
    }

    @Operation(
            summary = "Delete competitor",
            description = "Deletes a competitor by ID.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Competitor deleted successfully"),
                    @ApiResponse(responseCode = "404", description = "Competitor not found"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deleteCompetitor(@PathVariable Long id) {
        log.info("Deleting competitor: {}", id);
        competitorService.deleteCompetitor(id);
        return ResponseEntity.noContent().build();
    }


    @Operation(
            summary = "Get total competitor tracking count",
            description = "Returns total number of competitor tracking records for analytics.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracking count returned successfully")
            }
    )

    @GetMapping("/tracking/total-count")
    public ResponseEntity<@NonNull Long> getTotalCompetitorTrackingCount() {
        return ResponseEntity.ok(
                competitorService.getTotalCompetitorTrackingCount()
        );
    }
}