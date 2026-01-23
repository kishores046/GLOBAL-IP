package com.teamb.globalipbackend1.repository.competitor;

import com.teamb.globalipbackend1.model.patents.Competitor;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitorRepository extends JpaRepository<@NonNull Competitor, @NonNull Long> {

    Optional<Competitor> findByCode(String code);

    boolean existsByCode(String code);

    List<Competitor> findByActiveTrue();

    @Query("""
        SELECT c FROM Competitor c
        WHERE c.active = true
        ORDER BY c.displayName
    """)
    List<Competitor> findAllActiveOrderByName();

    @Query("""
        SELECT c FROM Competitor c
        WHERE LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.displayName) LIKE LOWER(CONCAT('%', :search, '%'))
        ORDER BY c.displayName
    """)
    List<Competitor> searchCompetitors(@Param("search") String search);
}
