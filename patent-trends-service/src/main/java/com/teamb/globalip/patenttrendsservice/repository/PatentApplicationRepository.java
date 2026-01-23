package com.teamb.globalip.patenttrendsservice.repository;

import com.teamb.globalip.patenttrendsservice.domain.PatentApplicationEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentApplicationRepository
        extends JpaRepository<@NonNull PatentApplicationEntity, @NonNull String> {

    @Query(value = """
        SELECT year, filings
        FROM public.agg_filing_trend_yearly
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> filingTrend();


    @Query(value = """
        SELECT grant_year, avg_years_to_grant
        FROM public.agg_time_to_grant_yearly
        ORDER BY grant_year
        """, nativeQuery = true)
    List<Object[]> timeToGrantTrend();


    // Year summary can remain RAW (cheap query)
    @Query(value = """
        SELECT COUNT(*)
        FROM public.patent_application
        WHERE filing_date >= make_date(:year,1,1)
          AND filing_date <  make_date(:year+1,1,1)
        """, nativeQuery = true)
    Long filingsForYear(@Param("year") int year);


    @Query(value = """
        SELECT AVG((p.grant_date - pa.filing_date) / 365.25)
        FROM public.patent_application pa
        JOIN public.patent p ON pa.patent_id = p.patent_id
        WHERE p.withdrawn = false
          AND p.grant_date >= make_date(:year,1,1)
          AND p.grant_date <  make_date(:year+1,1,1)
        """, nativeQuery = true)
    Double avgTimeToGrantForYear(@Param("year") int year);
}
