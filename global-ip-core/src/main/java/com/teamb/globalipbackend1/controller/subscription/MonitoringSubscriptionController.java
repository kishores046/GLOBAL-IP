package com.teamb.globalipbackend1.controller.subscription;

import com.teamb.globalipbackend1.dto.subscription.*;
import com.teamb.globalipbackend1.model.subscription.MonitoringSubscription;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.subscription.MonitoringSubscriptionService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
@RequiredArgsConstructor
public class MonitoringSubscriptionController {

    private final MonitoringSubscriptionService service;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<@NonNull SubscriptionResponse> createSubscription(
            @RequestBody CreateSubscriptionRequest request
    ) {
        String userId = securityUtil.getUserId();
        return ResponseEntity.ok(
                service.createSubscription(userId, request)
        );
    }


    @GetMapping("/activeByType")
    public ResponseEntity<@NonNull SubscriptionResponse> getActiveSubscriptionByType(
            @RequestParam MonitoringType type
    ) {
        String userId = securityUtil.getUserId();

        MonitoringSubscription sub =
                service.requireActiveSubscription(userId, type);

        return ResponseEntity.ok(
                new SubscriptionResponse(
                        sub.getId(),
                        sub.getType(),
                        sub.getTier(),
                        sub.getAlertFrequency(),
                        sub.getStatus(),
                        sub.getCreatedAt()
                )
        );
    }
    @GetMapping("/active")
    public ResponseEntity<@NonNull List<SubscriptionResponse>> getActiveSubscription(
    ){
        String userId = securityUtil.getUserId();

        return ResponseEntity.ok(
                service.getActiveSubscriptions(userId)
        );
    }



}
