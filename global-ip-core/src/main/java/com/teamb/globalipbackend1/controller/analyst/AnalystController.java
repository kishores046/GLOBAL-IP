package com.teamb.globalipbackend1.controller.analyst;

import com.teamb.globalipbackend1.service.search.SearchActivityService;
import com.teamb.globalipbackend1.service.user.GraphViewTracker;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst")
@RequiredArgsConstructor
@Tag(name = "Analyst", description = "Analyst dashboard and analytics APIs")
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKeyAuth")
public class AnalystController {



   private final SearchActivityService searchActivityService;
  private final GraphViewTracker graphViewTracker;

    @Operation(
            summary = "Get analyst dashboard",
            description = "Returns dashboard data for analyst or admin users.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Dashboard data retrieved"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<?> getAnalystDashboard() {
        return ResponseEntity.ok("Analyst Dashboard Data");
    }


    @Operation(
            summary = "Get analyst search count",
            description = "Returns total number of searches performed by the analyst.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Search count returned"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    @GetMapping("/dashboard/my/searchCount")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<@NonNull  Long> searchCount(){
        return ResponseEntity.ok(searchActivityService.getAnalystSearchCount());
    }



    @Operation(
            summary = "Get total graph view count",
            description = "Returns the total number of graph views across the analyst dashboard. Used for analytics and engagement tracking.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Total graph view count returned successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @GetMapping("/dashboard/graphs/total-count")
    public ResponseEntity<@NonNull Long> totalGraphCount() {
        return ResponseEntity.ok(graphViewTracker.getTotalGraphViews());
    }

}