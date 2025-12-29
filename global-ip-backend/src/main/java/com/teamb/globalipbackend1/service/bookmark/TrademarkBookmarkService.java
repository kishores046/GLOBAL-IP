package com.teamb.globalipbackend1.service.bookmark;

import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.trademark.BookmarkedTrademarkDto;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmark;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmarkRepository;
import com.teamb.globalipbackend1.service.trademark.TrademarkSnapshot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrademarkBookmarkService {

    private final TrademarkBookmarkRepository repository;

    private final CacheManager cacheManager;

    public List<BookmarkedTrademarkDto> getBookmarkedTrademarks(String userId) {

        Cache snapshotCache =
                cacheManager.getCache(CacheNames.TRADEMARK_SNAPSHOT);

        return repository.findByUserId(userId)
                .stream()
                .map(b -> {

                    TrademarkSnapshot snapshot =
                            snapshotCache != null
                                    ? snapshotCache.get(
                                    b.getTrademarkId(),
                                    TrademarkSnapshot.class
                            )
                                    : null;

                    BookmarkedTrademarkDto dto = new BookmarkedTrademarkDto();
                    dto.setTrademarkId(b.getTrademarkId());
                    dto.setSource(b.getSource());


                    if (snapshot != null) {
                        dto.setMarkName(snapshot.getMarkName());
                        dto.setJurisdiction(snapshot.getJurisdiction());
                        dto.setFilingDate(snapshot.getFilingDate());
                        dto.setStatusCode(snapshot.getStatusCode());
                    }

                    return dto;
                })
                .toList();
    }

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
    @Transactional
    public void unsave(String userId, String trademarkId) {
        repository.deleteByUserIdAndTrademarkId(userId, trademarkId);
        log.info("Trademark unbookmarked: {} by {}", trademarkId, userId);
    }





}
