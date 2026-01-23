package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentRepository extends JpaRepository<@NonNull EpoPatentEntity,@NonNull String> {
    boolean existsByEpoPatentId(String epoPatentId);



    @Query(value = """
        SELECT EXTRACT(YEAR FROM publication_date)::int AS year,
               COUNT(*) AS cnt
        FROM public.epo_patent
        WHERE publication_date IS NOT NULL
        GROUP BY year
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> filingTrend();


    @Query(value = """
        SELECT country, COUNT(*) AS cnt
        FROM public.epo_patent
        GROUP BY country
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> countryDistribution();
}