package com.teamb.globalipbackend1.repository.competitor;

import com.teamb.globalipbackend1.dto.competitor.CompetitorFilingSummary;
import com.teamb.globalipbackend1.model.patents.CompetitorFiling;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitorFilingRepository extends JpaRepository<@NonNull CompetitorFiling, @NonNull Long> {

    boolean existsByPatentId(String patentId);

    Optional<CompetitorFiling> findByPatentId(String patentId);

    @Query("""
   SELECT f FROM CompetitorFiling f
   WHERE f.competitorId = :competitorId
   ORDER BY f.publicationDate DESC NULLS LAST
""")
    List<CompetitorFiling> findByCompetitorIdOrderByPublicationDateDesc(
            @Param("competitorId") Long competitorId
    );


    Page<@NonNull CompetitorFiling> findByCompetitorIdOrderByPublicationDateDesc(
            Long competitorId,
            Pageable pageable
    );

    // Date range queries
    @Query("""
        SELECT cf FROM CompetitorFiling cf
        WHERE cf.competitorId = :competitorId
          AND cf.publicationDate BETWEEN :fromDate AND :toDate
        ORDER BY cf.publicationDate DESC
    """)
    List<CompetitorFiling> findByCompetitorAndDateRange(
            @Param("competitorId") Long competitorId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    // Advanced search with multiple filters
    @Query("""
        SELECT cf FROM CompetitorFiling cf
        WHERE (:competitorIds IS NULL OR cf.competitorId IN :competitorIds)
          AND (:fromDate IS NULL OR cf.publicationDate >= :fromDate)
          AND (:toDate IS NULL OR cf.publicationDate <= :toDate)
          AND (:jurisdiction IS NULL OR cf.jurisdiction = :jurisdiction)
        ORDER BY cf.publicationDate DESC
    """)
    Page<@NonNull CompetitorFiling> searchFilings(
            @Param("competitorIds") List<Long> competitorIds,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            @Param("jurisdiction") String jurisdiction,
            Pageable pageable
    );

    // Trend data - count by competitor
    @Query("""
        SELECT cf.competitorId, COUNT(cf)
        FROM CompetitorFiling cf
        WHERE cf.publicationDate >= :fromDate
        GROUP BY cf.competitorId
    """)
    List<Object[]> countByCompetitorSince(@Param("fromDate") LocalDate fromDate);

    // Trend data - count by competitor and month
    @Query("""
        SELECT cf.competitorId, 
               YEAR(cf.publicationDate), 
               MONTH(cf.publicationDate), 
               COUNT(cf)
        FROM CompetitorFiling cf
        WHERE cf.publicationDate >= :fromDate
        GROUP BY cf.competitorId, YEAR(cf.publicationDate), MONTH(cf.publicationDate)
        ORDER BY YEAR(cf.publicationDate), MONTH(cf.publicationDate)
    """)
    List<Object[]> countByCompetitorAndMonth(@Param("fromDate") LocalDate fromDate);

    // Summary statistics
    @Query("""
    SELECT
        COUNT(cf),
        MIN(cf.publicationDate),
        MAX(cf.publicationDate),
        COUNT(DISTINCT cf.competitorId)
    FROM CompetitorFiling cf
""")
    Object[] getFilingSummaryStats();

    @Query("""
    SELECT new com.teamb.globalipbackend1.dto.competitor.CompetitorFilingSummary(
        CAST(cf.competitorId AS string),
        cf.filedBy,
        COUNT(cf),
        MAX(cf.publicationDate)
    )
    FROM CompetitorFiling cf
    GROUP BY cf.competitorId, cf.filedBy
""")
    List<CompetitorFilingSummary> getFilingSummaryByCompetitor();



    // Latest filings across all competitors
    @Query("""
        SELECT cf FROM CompetitorFiling cf
        WHERE cf.publicationDate >= :fromDate
        ORDER BY cf.publicationDate DESC, cf.fetchedAt DESC
    """)
    Page<@NonNull CompetitorFiling> findRecentFilings(
            @Param("fromDate") LocalDate fromDate,
            Pageable pageable
    );

    // Count filings by jurisdiction
    @Query("""
        SELECT cf.jurisdiction, COUNT(cf)
        FROM CompetitorFiling cf
        WHERE cf.competitorId = :competitorId
          AND cf.publicationDate >= :fromDate
        GROUP BY cf.jurisdiction
    """)
    List<Object[]> countByJurisdiction(
            @Param("competitorId") Long competitorId,
            @Param("fromDate") LocalDate fromDate
    );


    @Query("""
    SELECT COUNT(DISTINCT cf.competitorId)
    FROM CompetitorFiling cf
""")
    long getTotalTrackedCompetitors();
}
