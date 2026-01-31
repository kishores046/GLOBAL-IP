package com.mock.mocktrademarkapi.repository;

import com.mock.mocktrademarkapi.dto.TrademarkSearchFilter;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import jakarta.persistence.criteria.*;
import lombok.NonNull;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TradeMarkSpecifications {

    public static Specification<@NonNull TradeMarkEntity> withFilter(TrademarkSearchFilter f) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasText(f.getMarkName())) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("markName")),
                                "%" + f.getMarkName().toLowerCase() + "%"
                        )
                );
            }

            if (hasText(f.getCountry())) {
                // Simpler: Use IN clause with subquery
                Subquery<String> ownerSubquery = query.subquery(String.class);
                Root<TradeMarkEntity> subRoot = ownerSubquery.from(TradeMarkEntity.class);
                Join<Object, Object> ownerJoin = subRoot.join("owners");

                ownerSubquery.select(subRoot.get("id"))
                        .where(cb.equal(ownerJoin.get("ownerCountry"), f.getCountry()));

                predicates.add(root.get("id").in(ownerSubquery));
            }

            if (hasText(f.getGoodsAndServicesText())) {
                // Simpler: Use IN clause with subquery
                Subquery<String> goodsSubquery = query.subquery(String.class);
                Root<TradeMarkEntity> subRoot = goodsSubquery.from(TradeMarkEntity.class);
                Join<Object, Object> goodsJoin = subRoot.join("goodsAndServices");

                goodsSubquery.select(subRoot.get("id"))
                        .where(cb.like(
                                goodsJoin.get("description"),
                                "%" + f.getGoodsAndServicesText() + "%"
                        ));

                predicates.add(root.get("id").in(goodsSubquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}