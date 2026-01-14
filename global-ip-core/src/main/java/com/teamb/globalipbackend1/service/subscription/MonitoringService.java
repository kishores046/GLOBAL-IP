package com.teamb.globalipbackend1.service.subscription;


import com.teamb.globalipbackend1.exception.SubscriptionException;
import com.teamb.globalipbackend1.model.subscription.MonitoringAsset;
import com.teamb.globalipbackend1.model.subscription.Subscription;
import com.teamb.globalipbackend1.repository.subscription.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MonitoringService {

    private final SubscriptionRepository subscriptionRepo;
    private final MonitoringRepository monitoringRepo;

    public void addMonitoringIp(String userId, String ip) {

        Subscription sub = subscriptionRepo
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() ->
                        new SubscriptionException("No active subscription"));

        if (monitoringRepo.existsByUserIdAndIpAddress(userId, ip)) {
            throw new SubscriptionException("IP already monitored");
        }

        long currentCount = monitoringRepo.countByUserId(userId);

        if (currentCount >= sub.getPlanType().getMonitoringLimit()) {
            throw new SubscriptionException("Upgrade plan");
        }

        MonitoringAsset asset = new MonitoringAsset();
        asset.setUserId(userId);
        asset.setIpAddress(ip);

        monitoringRepo.save(asset);
    }

    public List<MonitoringAsset> getMonitoringIps(String userId) {
        return monitoringRepo.findByUserId(userId);
    }

    @Transactional
    public void removeMonitoringIp(String userId, String ip) {

        if (!monitoringRepo.existsByUserIdAndIpAddress(userId, ip)) {
            throw new SubscriptionException("IP not found in monitoring list");
        }

        monitoringRepo.deleteByUserIdAndIpAddress(userId, ip);
    }



}
