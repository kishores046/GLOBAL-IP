package com.teamb.globalipbackend1.service.patent.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.TrademarkLifecycleDto;
import com.teamb.globalipbackend1.model.lifecycle.UserTrademarkLifecycle;
import com.teamb.globalipbackend1.repository.user.UserTrademarkLifecycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrademarkLifecyclePersistenceService {

    private final UserTrademarkLifecycleRepository repository;

    /**
     * Save or update trademark lifecycle (per user)
     */
    @Transactional
    public void save(
            String userId,
            TrademarkLifecycleDto dto
    ) {
        UserTrademarkLifecycle entity =
                repository.findByUserIdAndTrademarkId(userId, dto.trademarkId())
                        .orElseGet(UserTrademarkLifecycle::new);

        entity.setUserId(userId);
        entity.setTrademarkId(dto.trademarkId());
        entity.setStatus(dto.status());
        entity.setRawStatusCode(dto.rawStatusCode());
        entity.setFilingDate(dto.filingDate());
        entity.setLastUpdated(LocalDate.now());

        repository.save(entity);
    }

    /**
     * Fetch lifecycle for a specific trademark
     */
    @Transactional(readOnly = true)
    public UserTrademarkLifecycle getLifecycle(
            String userId,
            String trademarkId
    ) {
        return repository.findByUserIdAndTrademarkId(userId, trademarkId)
                .orElseThrow(() ->
                        new RuntimeException("Trademark lifecycle not found"));
    }

    /**
     * Dashboard use-case
     */
    @Transactional(readOnly = true)
    public List<UserTrademarkLifecycle> getAllForUser(String userId) {
        return repository.findAllByUserId(userId);
    }
}
