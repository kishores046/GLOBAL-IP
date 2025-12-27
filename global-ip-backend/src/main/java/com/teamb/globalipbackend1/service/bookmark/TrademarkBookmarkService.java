package com.teamb.globalipbackend1.service.bookmark;

import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmark;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmarkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrademarkBookmarkService {

    private final TrademarkBookmarkRepository repository;

    /**
     * Save (bookmark) a trademark for a user
     */
    public void save(String userId, String trademarkId, String source) {

        repository.findByUserIdAndTrademarkId(userId, trademarkId)
                .ifPresent(b -> {
                    log.info("Trademark already bookmarked: {} by {}", trademarkId, userId);
                    return;
                });

        TrademarkBookmark bookmark = new TrademarkBookmark();
        bookmark.setUserId(userId);
        bookmark.setTrademarkId(trademarkId);
        bookmark.setSource(source);

        repository.save(bookmark);

        log.info("Trademark bookmarked: {} by {}", trademarkId, userId);
    }

    /**
     * Remove bookmark
     */
    public void unsave(String userId, String trademarkId) {
        repository.deleteByUserIdAndTrademarkId(userId, trademarkId);
        log.info("Trademark unbookmarked: {} by {}", trademarkId, userId);
    }

    /**
     * Check if a trademark is bookmarked by user
     */
    public boolean isBookmarked(String userId, String trademarkId) {
        return repository.findByUserIdAndTrademarkId(userId, trademarkId).isPresent();
    }

    /**
     * Get all bookmarked trademarks for a user
     * (IDs only – details fetched lazily later)
     */
    public List<String> getBookmarkedTrademarkIds(String userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(TrademarkBookmark::getTrademarkId)
                .toList();
    }
}
