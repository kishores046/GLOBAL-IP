package com.teamb.globalipbackend1.controller.competitor;

import com.teamb.globalipbackend1.dto.competitor.CompetitorCreateRequest;
import com.teamb.globalipbackend1.dto.competitor.CompetitorDTO;
import com.teamb.globalipbackend1.dto.competitor.CompetitorUpdateRequest;
import com.teamb.globalipbackend1.service.patent.competitor.CompetitorService;
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
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
public class CompetitorController {

    private final CompetitorService competitorService;

    @PostMapping
    public ResponseEntity<@NonNull  CompetitorDTO> createCompetitor(
            @RequestBody CompetitorCreateRequest request) {

        log.info("Creating competitor: {}", request.getCode());
        CompetitorDTO competitor = competitorService.createCompetitor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(competitor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<@NonNull CompetitorDTO> updateCompetitor(
            @PathVariable Long id,
            @RequestBody CompetitorUpdateRequest request) {

        log.info("Updating competitor: {}", id);
        CompetitorDTO competitor = competitorService.updateCompetitor(id, request);
        return ResponseEntity.ok(competitor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NonNull CompetitorDTO> getCompetitor(@PathVariable Long id) {
        CompetitorDTO competitor = competitorService.getCompetitor(id);
        return ResponseEntity.ok(competitor);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<@NonNull CompetitorDTO> getCompetitorByCode(@PathVariable String code) {
        CompetitorDTO competitor = competitorService.getCompetitorByCode(code);
        return ResponseEntity.ok(competitor);
    }

    @GetMapping
    public ResponseEntity<@NonNull List<CompetitorDTO>> listCompetitors(
            @RequestParam(required = false, defaultValue = "true") boolean activeOnly) {

        List<CompetitorDTO> competitors = activeOnly
                ? competitorService.listActiveCompetitors()
                : competitorService.listAllCompetitors();

        return ResponseEntity.ok(competitors);
    }

    @GetMapping("/search")
    public ResponseEntity<@NonNull List<CompetitorDTO>> searchCompetitors(
            @RequestParam String q) {

        List<CompetitorDTO> competitors = competitorService.searchCompetitors(q);
        return ResponseEntity.ok(competitors);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deleteCompetitor(@PathVariable Long id) {
        log.info("Deleting competitor: {}", id);
        competitorService.deleteCompetitor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tracking/total-count")
    public ResponseEntity<@NonNull Long> getTotalCompetitorTrackingCount() {
        return ResponseEntity.ok(
                competitorService.getTotalCompetitorTrackingCount()
        );
    }
}