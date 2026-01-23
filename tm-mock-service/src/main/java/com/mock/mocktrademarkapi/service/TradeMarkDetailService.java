package com.mock.mocktrademarkapi.service;

import com.mock.mocktrademarkapi.dto.TradeMarkMapper;
import com.mock.mocktrademarkapi.dto.TradeMarkResponseDto;
import com.mock.mocktrademarkapi.mapper.TrademarkMapper;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import com.mock.mocktrademarkapi.repository.TrademarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TradeMarkDetailService {

    private final TrademarkRepository repository;
    private final TradeMarkMapper tradeMarkMapper;

    @Transactional(readOnly = true)
    public TradeMarkResponseDto getById(String id) {
        TradeMarkEntity entity = repository.findById(id)
                .orElseThrow(()->new RuntimeException("No Trademark id found"));
        return tradeMarkMapper.toDto(entity);
    }
}
