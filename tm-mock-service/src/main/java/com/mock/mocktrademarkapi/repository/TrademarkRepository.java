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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TrademarkRepository extends JpaRepository<@NonNull TradeMarkEntity,@NonNull String>, JpaSpecificationExecutor<@NonNull TradeMarkEntity> {

    Page<TradeMarkEntity> findAll(Specification<TradeMarkEntity> spec, Pageable pageable);

    // Fetch full entity with relationships by ID (for detail view only)
    @Query("SELECT DISTINCT t FROM TradeMarkEntity t " +
            "LEFT JOIN FETCH t.owners " +
            "LEFT JOIN FETCH t.internationalClasses " +
            "LEFT JOIN FETCH t.goodsAndServices " +
            "WHERE t.id = :id")
    TradeMarkEntity findByIdWithRelations(@Param("id") String id);
}
