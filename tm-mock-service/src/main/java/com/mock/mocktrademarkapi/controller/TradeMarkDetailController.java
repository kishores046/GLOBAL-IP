package com.mock.mocktrademarkapi.controller;

import com.mock.mocktrademarkapi.dto.TradeMarkMapper;
import com.mock.mocktrademarkapi.dto.TradeMarkResponseDto;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import com.mock.mocktrademarkapi.service.TradeMarkDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trademarks")
@RequiredArgsConstructor
public class TradeMarkDetailController {

    private final TradeMarkDetailService service;

    @GetMapping("/{id}")
    public TradeMarkResponseDto getDetail(@PathVariable String id) {
        return service.getById(id);

    }
}
