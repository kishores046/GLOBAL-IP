package com.teamb.globalip.patenttrendsservice.repository.epo;


import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentAssigneeEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpoPatentAssigneeRepository extends JpaRepository<@NonNull EpoPatentAssigneeEntity, @NonNull Long> {
    boolean existsByEpoPatentIdAndOrganizationName(
            String epoPatentId, String organizationName);
    @Query(value = """
        SELECT organization_name, COUNT(DISTINCT epo_patent_id) AS cnt
        FROM public.epo_patent_assignee
        WHERE organization_name IS NOT NULL
        GROUP BY organization_name
        ORDER BY cnt DESC
        """, nativeQuery = true)
    List<Object[]> topAssignees();
}