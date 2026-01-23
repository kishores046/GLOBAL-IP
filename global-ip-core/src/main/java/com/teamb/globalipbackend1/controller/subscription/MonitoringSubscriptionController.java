package com.teamb.globalipbackend1.controller.subscription;

import com.teamb.globalipbackend1.dto.subscription.*;
import com.teamb.globalipbackend1.model.subscription.MonitoringSubscription;
import com.teamb.globalipbackend1.model.subscription.MonitoringType;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.subscription.MonitoringSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
@Tag(
        name = "Subscriptions",
        description = "Monitoring subscription management APIs"
)
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class MonitoringSubscriptionController {

    private final MonitoringSubscriptionService service;
    private final SecurityUtil securityUtil;


    @Operation(
            summary = "Create subscription",
            description = "Creates a new monitoring subscription for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Subscription created successfully")
            }
    )

    @PostMapping
    public ResponseEntity<@NonNull SubscriptionResponse> createSubscription(
            @RequestBody CreateSubscriptionRequest request
    ) {
        String userId = securityUtil.getUserId();
        return ResponseEntity.ok(
                service.createSubscription(userId, request)
        );
    }

    @Operation(
            summary = "Get active subscription by type",
            description = "Returns the active subscription for a given monitoring type. "
                    + "Fails if no active subscription exists.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Active subscription returned"),
                    @ApiResponse(responseCode = "403", description = "No active subscription")
            }
    )

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

    @Operation(
            summary = "Get active subscriptions",
            description = "Returns all active monitoring subscriptions for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Active subscriptions returned successfully")
            }
    )
    @GetMapping("/active")
    public ResponseEntity<@NonNull List<SubscriptionResponse>> getActiveSubscription(
    ){
        String userId = securityUtil.getUserId();

        return ResponseEntity.ok(
                service.getActiveSubscriptions(userId)
        );
    }



}
