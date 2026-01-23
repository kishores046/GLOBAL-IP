package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.GraphViewEvent;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GraphViewRepository extends JpaRepository<@NonNull GraphViewEvent,@NonNull Long> {
    @Query("""
        SELECT g.graphKey, COUNT(g)
        FROM GraphViewEvent g
        WHERE g.userId = :userId
        GROUP BY g.graphKey
    """)
    List<Object[]> findGraphViewCounts(String userId);

    long countByUserId(String userId);

    @Query("SELECT COUNT(g) FROM GraphViewEvent g")
    long getTotalGraphViewCount();
}
