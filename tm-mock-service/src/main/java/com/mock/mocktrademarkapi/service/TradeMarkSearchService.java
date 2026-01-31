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


        Page<@NonNull TradeMarkEntity> page = repository.findAll(spec, pageable);

        page.getContent().forEach(tm -> {

            tm.getOwners().isEmpty();
            tm.getInternationalClasses().isEmpty();
            tm.getGoodsAndServices().isEmpty();
        });

        return page;
    }

    @Transactional(readOnly = true)
    public TradeMarkEntity getById(String id) {

        return repository.findByIdWithRelations(id);
    }
}