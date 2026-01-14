package com.teamb.globalipbackend1.repository.subscription;


import com.teamb.globalipbackend1.model.subscription.MonitoringAsset;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonitoringRepository
        extends JpaRepository<@NonNull MonitoringAsset,@NonNull Long> {

    long countByUserId(String userId);

    boolean existsByUserIdAndIpAddress(String userId, String ipAddress);

    List<MonitoringAsset> findByUserId(String userId);

    void deleteByUserIdAndIpAddress(String userId, String ipAddress);
}
