package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentCpcEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentCpcRepository extends JpaRepository<@NonNull EpoPatentCpcEntity, @NonNull Long> {

    boolean existsByEpoPatentIdAndCpcSectionAndCpcClass(
            String epoPatentId, String cpcSection, String cpcClass);

    /**
     * Get top technologies (CPC sections) using aggregated table for improved performance
     * Returns: cpc_section, cnt
     */
    @Query(value = """
        SELECT cpc_section, cnt
        FROM public.epo_agg_top_technologies
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> topTechnologies();
}