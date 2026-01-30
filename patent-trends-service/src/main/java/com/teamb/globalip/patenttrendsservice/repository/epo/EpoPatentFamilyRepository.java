package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentFamilyEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentFamilyRepository extends JpaRepository<@NonNull EpoPatentFamilyEntity, @NonNull Long> {

    /**
     * Get family size distribution using aggregated table for improved performance
     * Returns: family_size, family_count
     */
    @Query(value = """
        SELECT family_size, family_count
        FROM public.epo_agg_family_size_distribution
        ORDER BY family_size
        """, nativeQuery = true)
    List<Object[]> familySizeDistribution();
}