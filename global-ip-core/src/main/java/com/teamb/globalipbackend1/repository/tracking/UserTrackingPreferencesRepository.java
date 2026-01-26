package com.teamb.globalipbackend1.repository.tracking;

import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferences;
import com.teamb.globalipbackend1.model.tracking.UserTrackingPreferencesId;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTrackingPreferencesRepository extends JpaRepository<@NonNull UserTrackingPreferences, @NonNull UserTrackingPreferencesId> {

    /**
     * Find all tracking preferences for a specific user
     */
    List<UserTrackingPreferences> findByIdUserId(String userId);

    /**
     * Find tracking preferences for a specific user and patent
     */
    Optional<UserTrackingPreferences> findByIdUserIdAndIdPatentId(String userId, String patentId);

    /**
     * Find all users tracking a specific patent (for broadcast notifications)
     */
    List<UserTrackingPreferences> findByIdPatentId(String patentId);

    /**
     * Find all users with email notifications enabled for a specific patent
     */
    List<UserTrackingPreferences> findByIdPatentIdAndEnableEmailNotificationsTrue(String patentId);

    /**
     * Delete tracking preferences for a user and patent
     */
    void deleteByIdUserIdAndIdPatentId(String userId, String patentId);

    long countByIdUserId(String userId);
}