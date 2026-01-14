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

    @Query(value = """
        SELECT cpc_section, COUNT(DISTINCT epo_patent_id) AS cnt
        FROM public.epo_patent_cpc
        GROUP BY cpc_section
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> topTechnologies();
}
