package com.teamb.globalip.patenttrendsservice.repository.epo;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentAssigneeEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentAssigneeRepository extends JpaRepository<@NonNull EpoPatentAssigneeEntity, @NonNull Long> {

    boolean existsByEpoPatentIdAndOrganizationName(
            String epoPatentId, String organizationName);

    /**
     * Get top assignees using aggregated table for improved performance
     * Returns: organization_name, cnt
     */
    @Query(value = """
    SELECT organization_name, cnt
    FROM public.epo_agg_top_assignees
    ORDER BY cnt DESC
    LIMIT :limit
    """, nativeQuery = true)
    List<Object[]> topAssignees(@Param("limit") int limit);
}