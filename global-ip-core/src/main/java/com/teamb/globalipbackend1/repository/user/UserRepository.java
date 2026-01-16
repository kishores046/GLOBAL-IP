// Add these methods to your UserRepository interface

package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    // Existing methods...
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // ========== NEW METHODS FOR ADMIN FEATURES ==========

    /**
     * Find users who have NOT made any API calls since the given timestamp
     */
    @Query("""
        SELECT DISTINCT u FROM User u
        WHERE u.userId NOT IN (
            SELECT DISTINCT l.userId FROM ApiUsageLog l
            WHERE l.timestamp >= :since
        )
        ORDER BY u.createdAt DESC
    """)
    List<User> findInactiveUsersSince(@Param("since") LocalDateTime since);
}