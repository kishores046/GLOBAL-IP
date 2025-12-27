package com.teamb.globalipbackend1.repository.bookmark;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrademarkBookmarkRepository
        extends JpaRepository<@NonNull TrademarkBookmark,@NonNull Long> {

    Optional<TrademarkBookmark> findByUserIdAndTrademarkId(String userId, String trademarkId);

    List<TrademarkBookmark> findByUserId(String userId);

    void deleteByUserIdAndTrademarkId(String userId, String trademarkId);
}
