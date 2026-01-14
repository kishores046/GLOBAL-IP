package com.teamb.globalip.patenttrendsservice.repository;

import com.teamb.globalip.patenttrendsservice.domain.PatentEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatentRepository
        extends JpaRepository<@NonNull PatentEntity, @NonNull String> {

    @Query(value = """
        SELECT year, avg_claims
        FROM public.agg_grant_claim_trend
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> grantTrend();


    @Query(value = """
        SELECT year, avg_claims, median_claims
        FROM public.agg_grant_claim_trend
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> claimComplexityTrend();


    @Query(value = """
        SELECT country, grant_count
        FROM public.agg_country_grants
        ORDER BY grant_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> topCountries(@Param("limit") int limit);


    // Keep raw – lightweight
    @Query(value = """
        SELECT COUNT(*)
        FROM public.patent
        WHERE withdrawn = false
          AND grant_date >= make_date(:year,1,1)
          AND grant_date <  make_date(:year+1,1,1)
        """, nativeQuery = true)
    Long grantsForYear(@Param("year") int year);


    @Query(value = """
        SELECT patent_type, count
        FROM public.agg_patent_type_distribution
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> patentTypeDistribution();
}
