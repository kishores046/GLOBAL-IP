package com.teamb.globalip.patenttrendsservice.ingest;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EpoFamilyAggregator {

    private final JdbcTemplate jdbc;

    @Transactional
    public void updateFamilySizes() {
        jdbc.execute("""
            UPDATE public.epo_patent_family f
            SET family_size = sub.cnt
            FROM (
                SELECT family_id, COUNT(DISTINCT country) cnt
                FROM epo_patent
                WHERE family_id IS NOT NULL
                GROUP BY family_id
            ) sub
            WHERE f.family_id = sub.family_id
        """);
    }
}
