package com.teamb.globalipbackend1.controller.subscription;

import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/subscription")
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SecurityUtil securityUtil;

    @DeleteMapping("/cancel")
    public String cancelSubscription() {
        String userId = securityUtil.getUserId();
        subscriptionService.cancelSubscription(userId);
        return "Subscription cancelled successfully";
    }
}