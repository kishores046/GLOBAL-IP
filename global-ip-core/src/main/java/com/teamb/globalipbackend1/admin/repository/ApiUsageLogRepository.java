package com.teamb.globalipbackend1.admin.repository;

import com.teamb.globalipbackend1.admin.audit.ApiUsageLog;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ApiUsageLogRepository extends JpaRepository<@NonNull ApiUsageLog,@NonNull Long>, JpaSpecificationExecutor<@NonNull ApiUsageLog> {

    /* ---------- HEALTH ---------- */

    @Query("""
        select max(l.timestamp)
        from ApiUsageLog l
        where l.service = :service
          and l.status = 'SUCCESS'
    """)
    LocalDateTime lastSuccess(String service);

    @Query("""
        select
          sum(case when l.status = 'ERROR' then 1 else 0 end) * 1.0 / count(l)
        from ApiUsageLog l
        where l.service = :service
          and l.timestamp >= :since
    """)
    Double errorRate(String service, LocalDateTime since);

    @Query("""
        select avg(l.responseTimeMs)
        from ApiUsageLog l
        where l.service = :service
          and l.timestamp >= :since
    """)
    Double avgLatency(String service, LocalDateTime since);

    /* ---------- ADMIN OVERVIEW ---------- */

    @Query("""
        select count(distinct l.userId)
        from ApiUsageLog l
        where l.timestamp >= :since
    """)
    long activeUsers(LocalDateTime since);

    @Query("""
        select count(l)
        from ApiUsageLog l
        where l.timestamp >= :since
    """)
    long requestsSince(LocalDateTime since);

    @Query("""
        select count(l)
        from ApiUsageLog l
        where l.status = 'ERROR'
          and l.timestamp >= :since
    """)
    long errorsSince(LocalDateTime since);

    @Query("""
        select l.service, count(l)
        from ApiUsageLog l
        group by l.service
        order by count(l) desc
    """)
    List<Object[]> usageByService();

    @Query("""
        select l.action, count(l)
        from ApiUsageLog l
        group by l.action
        order by count(l) desc
    """)
    List<Object[]> usageByAction();

    @Query("""
        select
          l.service,
          count(l),
          sum(case when l.status = 'ERROR' then 1 else 0 end)
        from ApiUsageLog l
        where l.timestamp >= :since
        group by l.service
    """)
    List<Object[]> errorSummary(LocalDateTime since);



    /**
     * Count requests made by a specific user after a given timestamp
     */
    long countByUserIdAndTimestampAfter(String userId, LocalDateTime timestamp);

    /**
     * Get the most recent API usage log for a specific user
     */
    Optional<ApiUsageLog> findTopByUserIdOrderByTimestampDesc(String userId);

    /**
     * Get the most frequently used service by a specific user
     */
    @Query("""
        SELECT l.service
        FROM ApiUsageLog l
        WHERE l.userId = :userId
        GROUP BY l.service
        ORDER BY COUNT(l) DESC
        LIMIT 1
    """)
    String findTopServiceByUserId(@Param("userId") String userId);
}
