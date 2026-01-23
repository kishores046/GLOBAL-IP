package com.teamb.globalipbackend1.service.user;

import com.teamb.globalipbackend1.security.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Aspect
@Component
@RequiredArgsConstructor
public class GraphTrackingAspect {

    private final GraphViewTracker tracker;

    @AfterReturning("@annotation(trackGraph)")
    public void track(TrackGraph trackGraph) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) return;

        String userId =
                ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();

        tracker.track(userId, trackGraph.value());
    }
}
