package com.teamb.globalip.patenttrendsservice.repository;

import com.teamb.globalip.patenttrendsservice.domain.PatentAssigneeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentAssigneeRepository
        extends JpaRepository<PatentAssigneeEntity, Long> {

    @Query(value = """
        SELECT organization_name, patent_count
        FROM public.agg_top_assignees
        ORDER BY patent_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> topAssignees(int limit);


    @Query(value = """
        SELECT year, organization_name, patent_count
        FROM public.agg_assignee_yearly_activity
        WHERE patent_count >= :minPatents
        ORDER BY year, patent_count DESC
        """, nativeQuery = true)
    List<Object[]> assigneeActivityOverTime(int minPatents);


    @Query(value = """
        SELECT cpc_section, patent_count
        FROM public.agg_assignee_technology_focus
        WHERE organization_name = :assigneeName
        ORDER BY patent_count DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Object[]> assigneeTechnologyFocus(
            @Param("assigneeName") String assigneeName,
            @Param("limit") int limit
    );


    @Query(value = """
        SELECT year, patent_count
        FROM public.agg_assignee_yearly_activity
        WHERE organization_name = :assigneeName
          AND year BETWEEN :yearStart AND :yearEnd
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> assigneeYearlyActivity(
            @Param("assigneeName") String assigneeName,
            @Param("yearStart") int yearStart,
            @Param("yearEnd") int yearEnd
    );
}
