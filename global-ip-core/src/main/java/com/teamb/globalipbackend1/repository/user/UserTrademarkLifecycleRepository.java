package com.teamb.globalipbackend1.repository.user;



import com.teamb.globalipbackend1.model.lifecycle.UserTrademarkLifecycle;
import com.teamb.globalipbackend1.model.lifecycle.UserTrademarkLifecycleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserTrademarkLifecycleRepository
        extends JpaRepository<UserTrademarkLifecycle, UserTrademarkLifecycleId> {

    Optional<UserTrademarkLifecycle> findByUserIdAndTrademarkId(
            String userId,
            String trademarkId
    );

    List<UserTrademarkLifecycle> findAllByUserId(String userId);

    long countByUserIdAndStatus(String userId, String status);
}

