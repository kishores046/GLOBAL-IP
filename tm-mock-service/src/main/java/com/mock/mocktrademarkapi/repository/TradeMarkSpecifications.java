package com.mock.mocktrademarkapi.repository;

import com.mock.mocktrademarkapi.dto.TrademarkSearchFilter;
import com.mock.mocktrademarkapi.model.main.GoodsAndServiceEntity;
import com.mock.mocktrademarkapi.model.main.OwnerEntity;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
public class TradeMarkSpecifications {

    public static Specification<TradeMarkEntity> withFilter(TrademarkSearchFilter f) {

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
                Join<TradeMarkEntity, OwnerEntity> ownerJoin =
                        root.join("owners", JoinType.LEFT);
                predicates.add(
                        cb.equal(ownerJoin.get("ownerCountry"), f.getCountry())
                );
            }

            if (hasText(f.getGoodsAndServicesText())) {
                Join<TradeMarkEntity, GoodsAndServiceEntity> goodsJoin =
                        root.join("goodsAndServices", JoinType.LEFT);

                predicates.add(
                        cb.like(
                                goodsJoin.get("description"),
                                "%" + f.getGoodsAndServicesText() + "%"
                        )
                );

                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }



    private static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
