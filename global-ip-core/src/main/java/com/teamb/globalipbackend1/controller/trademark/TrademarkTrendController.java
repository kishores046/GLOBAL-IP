package com.teamb.globalipbackend1.controller.trademark;



import com.teamb.globalipbackend1.dto.trademark.trend.*;
import com.teamb.globalipbackend1.service.trademark.TrademarkTrendService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trends/trademarks")
@PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
public class TrademarkTrendController {

    private final TrademarkTrendService service;

    @GetMapping("/summary")
    public ResponseEntity<@NonNull Map<String, Object>> summary() {
        return ResponseEntity.ok(service.summary());
    }

    @GetMapping("/classes/top")
    public ResponseEntity<@NonNull List<CodeDistributionDto>> topClasses() {
        return ResponseEntity.ok(service.topClasses());
    }

    @GetMapping("/countries/top")
    public ResponseEntity<@NonNull List<SimpleCountDto>> topCountries() {
        return ResponseEntity.ok(service.topCountries());
    }

    @GetMapping("/status")
    public ResponseEntity<@NonNull List<SimpleCountDto>> statusDistribution() {
        return ResponseEntity.ok(service.statusDistribution());
    }
}
