package com.teamb.globalipbackend1.controller.analyst;

import com.teamb.globalipbackend1.dto.analyst.AnalystSearchResponse;
import com.teamb.globalipbackend1.dto.analyst.BasicStatisticsResponse;
import com.teamb.globalipbackend1.dto.analyst.TrendStatsResponse;
import com.teamb.globalipbackend1.service.analyst.AnalystService;
import com.teamb.globalipbackend1.service.search.SearchActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst")
@RequiredArgsConstructor
@Tag(name = "Analyst", description = "Analyst dashboard and analytics APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalystController {



   private final SearchActivityService searchActivityService;


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
}