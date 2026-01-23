package com.mock.mocktrademarkapi.repository;

import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TrademarkRepository extends JpaRepository<@NonNull TradeMarkEntity,@NonNull String>, JpaSpecificationExecutor<@NonNull TradeMarkEntity> {

    @EntityGraph(attributePaths = {
            "owners",
            "internationalClasses",
            "goodsAndServices"
    })
    Page<@NonNull TradeMarkEntity> findAll(
            @NonNull Specification<@NonNull TradeMarkEntity> spec,
            @NonNull  Pageable pageable
    );

    @EntityGraph(attributePaths = {
            "owners",
            "internationalClasses",
            "goodsAndServices"
    })
    Optional<TradeMarkEntity> findById(String id);
}
