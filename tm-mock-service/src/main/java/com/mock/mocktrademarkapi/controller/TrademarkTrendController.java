package com.mock.mocktrademarkapi.controller;

import com.mock.mocktrademarkapi.dto.trend.*;
import com.mock.mocktrademarkapi.service.TrademarkTrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends/trademarks")
@RequiredArgsConstructor
public class TrademarkTrendController {

    private final TrademarkTrendService service;

    

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return Map.of(
                "totalApplications", service.totalApplications(),
                "filingsByYear", service.filingsByYear(),
                "statusDistribution", service.statusDistribution()
        );
    }



    @GetMapping("/classes/top")
    public List<CodeDistributionDto> topClasses() {
        return service.topInternationalClasses();
    }



    @GetMapping("/countries/top")
    public List<SimpleCountDto> topCountries() {
        return service.topCountries();
    }



    @GetMapping("/status")
    public List<SimpleCountDto> statusDistribution() {
        return service.statusDistribution();
    }
}
