package com.mock.mocktrademarkapi.controller;

import com.mock.mocktrademarkapi.dto.TradeMarkMapper;
import com.mock.mocktrademarkapi.dto.TradeMarkResponseDto;
import com.mock.mocktrademarkapi.dto.TrademarkSearchFilter;
import com.mock.mocktrademarkapi.dto.common.PageResponse;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import com.mock.mocktrademarkapi.service.TradeMarkSearchService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trademarks")
@RequiredArgsConstructor
public class TradeMarkSearchController {

    private final TradeMarkSearchService service;
    private final TradeMarkMapper mapper;

    @PostMapping("/search")
    public PageResponse<TradeMarkResponseDto> search(
            @RequestBody TrademarkSearchFilter filter,
            Pageable pageable) {

        Page<@NonNull TradeMarkEntity> page =
                service.search(filter, pageable);

        PageResponse<TradeMarkResponseDto> resp = new PageResponse<>();
        resp.setContent(page.map(mapper::toDto).getContent());
        resp.setPageNumber(page.getNumber());
        resp.setPageSize(page.getSize());
        resp.setTotalElements(page.getTotalElements());
        resp.setTotalPages(page.getTotalPages());
        resp.setLast(page.isLast());

        return resp;
    }

}

