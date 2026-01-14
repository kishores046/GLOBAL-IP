package com.teamb.globalipbackend1.repository.trend;


import com.teamb.globalipbackend1.model.trend.UserPreference;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<@NonNull UserPreference, @NonNull Long> {
    Optional<UserPreference> findByUsername(String username);
}