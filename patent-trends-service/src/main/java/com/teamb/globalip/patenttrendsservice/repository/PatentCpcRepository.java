package com.teamb.globalip.patenttrendsservice.repository;

import com.teamb.globalip.patenttrendsservice.domain.PatentCpcEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentCpcRepository
        extends JpaRepository<@NonNull PatentCpcEntity,@NonNull Long> {

    @Query(value = """
        SELECT cpc_group, patent_count
        FROM public.agg_top_cpc_groups
        ORDER BY patent_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> topTechnologies(int limit);


    @Query(value = """
        SELECT year, cpc_section, patent_count
        FROM public.agg_technology_evolution
        ORDER BY year, patent_count DESC
        """, nativeQuery = true)
    List<Object[]> technologyEvolution();


    @Query(value = """
        SELECT section1, section2, co_occurrence
        FROM public.agg_technology_crossovers
        ORDER BY co_occurrence DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> technologyCrossovers(int minCount, int limit);
}
