package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentRepository extends JpaRepository<@NonNull EpoPatentEntity, @NonNull String> {

    boolean existsByEpoPatentId(String epoPatentId);

    /**
     * Get filing trend by year using aggregated table for improved performance
     * Returns: year, cnt
     */
    @Query(value = """
        SELECT year, cnt
        FROM public.epo_agg_filing_trend
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> filingTrend();

    /**
     * Get country distribution using aggregated table for improved performance
     * Returns: country, cnt
     */
    @Query(value = """
        SELECT country, cnt
        FROM public.epo_agg_country_distribution
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> countryDistribution();
}