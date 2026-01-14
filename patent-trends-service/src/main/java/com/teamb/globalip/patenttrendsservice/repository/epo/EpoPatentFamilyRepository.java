package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentFamilyEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentFamilyRepository extends JpaRepository<@NonNull EpoPatentFamilyEntity,@NonNull Long> {
    @Query(value = """
        SELECT family_size, COUNT(*) AS family_count
        FROM (
            SELECT family_id, COUNT(DISTINCT country) AS family_size
            FROM public.epo_patent
            WHERE family_id IS NOT NULL
            GROUP BY family_id
        ) sub
        GROUP BY family_size
        ORDER BY family_size
        """, nativeQuery = true)
    List<Object[]> familySizeDistribution();
}
