package com.teamb.globalipbackend1.controller.analyst;

import com.teamb.globalipbackend1.dto.analyst.AnalystSearchResponse;
import com.teamb.globalipbackend1.dto.analyst.BasicStatisticsResponse;
import com.teamb.globalipbackend1.dto.analyst.TrendStatsResponse;
import com.teamb.globalipbackend1.service.analyst.AnalystService;
import com.teamb.globalipbackend1.service.search.SearchActivityService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyst")
@RequiredArgsConstructor

public class AnalystController {



   private final SearchActivityService searchActivityService;


    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<?> getAnalystDashboard() {
        return ResponseEntity.ok("Analyst Dashboard Data");
    }

    @GetMapping("/dashboard/my/searchCount")
    @PreAuthorize("hasAnyRole('ANALYST', 'ADMIN')")
    public ResponseEntity<@NonNull  Long> searchCount(){
        return ResponseEntity.ok(searchActivityService.getAnalystSearchCount());
    }
}