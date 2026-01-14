package com.teamb.globalip.patenttrendsservice.repository;

import com.teamb.globalip.patenttrendsservice.domain.PatentCitationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentCitationRepository
        extends JpaRepository<PatentCitationEntity, Long> {



    @Query(value = """
        SELECT patent_id, title, citations_made
        FROM public.agg_top_citing_patents
        ORDER BY citations_made DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> topCitingPatents(int limit);

    @Query(value = """
        SELECT cited_patent_id, times_cited
        FROM public.agg_top_cited_patents
        ORDER BY times_cited DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> topCited(int limit);


    @Query(value = """
        SELECT citation_year, avg_citation_lag_years
        FROM public.agg_citation_lag_yearly
        ORDER BY citation_year
        """, nativeQuery = true)
    List<Object[]> citationLagTrend();
}