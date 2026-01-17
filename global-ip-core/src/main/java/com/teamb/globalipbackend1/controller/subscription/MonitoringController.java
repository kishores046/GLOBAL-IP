package com.teamb.globalipbackend1.controller.subscription;

import com.teamb.globalipbackend1.model.subscription.MonitoringAsset;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.subscription.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
@PreAuthorize("hasAnyRole('ANALSYT','ADMIN')")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringService monitoringService;
    private final SecurityUtil securityUtil;

    @PostMapping("/add")
    public String addIp(@RequestParam String ip) {

        String userId= securityUtil.getUserId();
        monitoringService.addMonitoringIp(userId, ip);
        return "Monitoring added successfully";
    }

    @GetMapping("/list")
    public List<MonitoringAsset> getMonitoringIps() {
        String userId= securityUtil.getUserId();
        return monitoringService.getMonitoringIps(userId);
    }

    @DeleteMapping("/remove")
    public String removeIp(@RequestParam String ip) {

        String userId = securityUtil.getUserId();
        monitoringService.removeMonitoringIp(userId, ip);
        return "Monitoring removed successfully";
    }
}