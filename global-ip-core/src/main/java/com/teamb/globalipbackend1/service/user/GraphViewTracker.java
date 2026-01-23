package com.teamb.globalipbackend1.service.user;

import com.teamb.globalipbackend1.model.user.GraphViewEvent;
import com.teamb.globalipbackend1.repository.user.GraphViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GraphViewTracker {

    private final GraphViewRepository repository;

    public void track(String userId, String graphKey) {
        GraphViewEvent e = new GraphViewEvent();
        e.setUserId(userId);
        e.setGraphKey(graphKey);
        e.setViewedAt(LocalDateTime.now());
        repository.save(e);
    }
    public long getTotalGraphViews() {
        return repository.count();
    }
}
