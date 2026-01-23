package com.mock.mocktrademarkapi.service;

import com.mock.mocktrademarkapi.dto.TrademarkSearchFilter;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import com.mock.mocktrademarkapi.repository.TradeMarkSpecifications;
import com.mock.mocktrademarkapi.repository.TrademarkRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TradeMarkSearchService {

    private final TrademarkRepository repository;
    @Transactional(readOnly = true)
    public Page<@NonNull TradeMarkEntity> search(
            TrademarkSearchFilter filter,
            Pageable pageable) {

        Specification<@NonNull TradeMarkEntity> spec =
                TradeMarkSpecifications.withFilter(filter);

        return repository.findAll(spec, pageable);
    }
}
