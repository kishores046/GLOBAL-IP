package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.SearchActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SearchActivityRepository extends JpaRepository<SearchActivity,Long> {


    @Query("""
        SELECT COUNT(sa)
        FROM SearchActivity sa
        WHERE sa.userId = :userId
    """)
    long countByUserId(@Param("userId") String userId);
}
