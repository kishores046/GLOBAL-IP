package com.teamb.globalipbackend1.controller.patent;

import com.teamb.globalipbackend1.dto.citation.*;
import com.teamb.globalipbackend1.service.patent.citations.EnhancedCitationNetworkService;
import com.teamb.globalipbackend1.service.patent.citations.PatentCitationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Controller for patent citations
 * - Uses EnhancedCitationNetworkService for visualization (network graphs)
 * - Uses PatentCitationService for database storage and detailed records
 */
@RestController
@RequestMapping("/api/patents/{patentId}/citations")
@PreAuthorize("hasAnyRole('USER','ANALYST','ADMIN')")
@Tag(
        name = "Patent Citations",
        description = "Patent citation networks, metrics, summaries, and storage APIs"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@Slf4j
@AllArgsConstructor
public class CitationController {
    
    private EnhancedCitationNetworkService enhancedNetworkService;
    private PatentCitationService citationService;

    /**
     * Get citation network for visualization (force-directed graph)
     * Fixed depth of 1 level to prevent network explosion
     * Example: GET /api/patents/10006624/citations/network
     */
    @Operation(
            summary = "Get citation network",
            description = "Returns a limited-depth citation network optimized for visualization "
                    + "(force-directed graphs). Depth is capped internally to avoid explosion.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citation network returned successfully")
            }
    )
    @GetMapping("/network")
    public ResponseEntity<@NonNull CitationNetworkResponse> getCitationNetwork(
            @PathVariable String patentId,
            @RequestParam(defaultValue = "1") int backwardDepth,
            @RequestParam(defaultValue = "1") int forwardDepth) {

        log.info("Fetching citation network for visualization: {} (requested backward: {}, forward: {})",
                patentId, backwardDepth, forwardDepth);

        // Service will limit depth to 1 automatically
        CitationNetworkResponse response = enhancedNetworkService.fetchCitationNetwork(
                patentId,
                backwardDepth,
                forwardDepth
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get citation metrics without full network data
     * Example: GET /api/patents/10006624/citations/metrics
     */
    @Operation(
            summary = "Get citation metrics",
            description = "Returns citation metrics (counts, influence scores) without full network data.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citation metrics returned successfully")
            }
    )
    @GetMapping("/metrics")
    public ResponseEntity<@NonNull NetworkMetrics> getCitationMetrics(
            @PathVariable String patentId) {

        log.info("Fetching citation metrics for patent: {}", patentId);

        CitationNetworkResponse network = enhancedNetworkService.fetchCitationNetwork(
                patentId, 1, 1
        );

        return ResponseEntity.ok(network.getMetrics());
    }

    /**
     * Get citation counts with helpful messages
     * Example: GET /api/patents/10006624/citations/counts
     */

    @Operation(
            summary = "Get citation counts",
            description = "Returns backward, forward, and total citation counts with contextual messages.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citation counts returned successfully")
            }
    )

    @GetMapping("/counts")
    public ResponseEntity<@NonNull CitationCountResponse> getCitationCounts(
            @PathVariable String patentId) {

        log.info("Fetching citation counts for patent: {}", patentId);

        CitationNetworkResponse network = enhancedNetworkService.fetchCitationNetwork(
                patentId, 1, 1
        );

        // Count backward vs forward
        long backwardCount = network.getEdges().stream()
                .filter(edge -> edge.getSource().equals(patentId))
                .count();

        long forwardCount = network.getEdges().stream()
                .filter(edge -> edge.getTarget().equals(patentId))
                .count();

        CitationCountResponse response = CitationCountResponse.builder()
                .patentId(patentId)
                .backwardCitations((int) backwardCount)
                .forwardCitations((int) forwardCount)
                .totalCitations((int) (backwardCount + forwardCount))
                .hasForwardCitations(forwardCount > 0)
                .message(forwardCount == 0 ?
                        "This patent has not yet been cited by later patents. This is common for new patents or highly specialized innovations." :
                        null)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Get citation summary with insights
     * Example: GET /api/patents/10006624/citations/summary
     */
    @Operation(
            summary = "Get citation summary",
            description = "Returns a summarized view of citation data including insights and metrics.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citation summary returned successfully")
            }
    )
    @GetMapping("/summary")
    public ResponseEntity<@NonNull CitationSummaryResponse> getCitationSummary(
            @PathVariable String patentId) {

        log.info("Fetching citation summary for patent: {}", patentId);

        CitationNetworkResponse network = enhancedNetworkService.fetchCitationNetwork(
                patentId, 1, 1
        );

        long backwardCount = network.getEdges().stream()
                .filter(edge -> edge.getSource().equals(patentId))
                .count();

        long forwardCount = network.getEdges().stream()
                .filter(edge -> edge.getTarget().equals(patentId))
                .count();

        List<String> insights = new ArrayList<>();

        if (forwardCount == 0) {
            insights.add("No forward citations found - patent may be new or not yet cited");
        }
        if (backwardCount > 10) {
            insights.add("High backward citation count (" + backwardCount + ") - heavily references prior art");
        }
        if (backwardCount == 0) {
            insights.add("No backward citations - unusual for most patents");
        }
        if (network.getNodes().size() >= 200) {
            insights.add("Citation network was truncated at 200 nodes to prevent performance issues");
        }

        CitationSummaryResponse response = CitationSummaryResponse.builder()
                .patentId(patentId)
                .backwardCitations((int) backwardCount)
                .forwardCitations((int) forwardCount)
                .totalNodes(network.getNodes().size())
                .totalEdges(network.getEdges().size())
                .depth(1)
                .insights(insights)
                .metrics(network.getMetrics())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Get detailed citation list from database (not for visualization)
     * Example: GET /api/patents/10006624/citations/list
     */
    @Operation(
            summary = "Get citation list (database)",
            description = "Returns detailed citation records stored in the database. "
                    + "Not intended for visualization.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citation list returned successfully")
            }
    )
    @GetMapping("/list")
    public ResponseEntity<@NonNull CitationNetworkDTO> getCitationList(
            @PathVariable String patentId) {

        log.info("Fetching citation list from database for patent: {}", patentId);

        CitationNetworkDTO citations = citationService.getCitationNetwork(patentId);

        return ResponseEntity.ok(citations);
    }

    /**
     * Fetch and store citations in database
     * This is typically called when a patent is first added to the system
     * Example: POST /api/patents/10006624/citations/fetch
     */
    @Operation(
            summary = "Fetch and store citations",
            description = "Fetches citation data from external sources and persists it in the database. "
                    + "Typically called when a patent is first onboarded.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Citations fetched and stored successfully"),
                    @ApiResponse(responseCode = "500", description = "Error while fetching citations")
            }
    )
    @PostMapping("/fetch")
    public ResponseEntity<@NonNull FetchCitationsResponse> fetchAndStoreCitations(
            @PathVariable String patentId) {

        log.info("Fetching and storing citations for patent: {}", patentId);

        try {
            citationService.fetchAndStoreCitations(patentId);

            CitationNetworkDTO network = citationService.getCitationNetwork(patentId);

            FetchCitationsResponse response = FetchCitationsResponse.builder()
                    .patentId(patentId)
                    .success(true)
                    .backwardCount(network.getBackwardCount())
                    .forwardCount(network.getForwardCount())
                    .message("Citations fetched and stored successfully")
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching citations for patent {}: {}", patentId, e.getMessage());

            FetchCitationsResponse response = FetchCitationsResponse.builder()
                    .patentId(patentId)
                    .success(false)
                    .message("Error fetching citations: " + e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(response);
        }
    }
}

