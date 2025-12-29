package com.teamb.globalipbackend1.service.trademark;



import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.external.tmview.TmViewClient;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrademarkDetailService {

    private final TmViewClient trademarkClient;
    private final TrademarkBookmarkRepository bookmarkRepository;
    private final CacheManager cacheManager;

    public GlobalTrademarkDetailDto getTrademarkDetail(
            String trademarkId,
            String userId
    ) {
        var cache = cacheManager.getCache(CacheNames.TRADEMARK_SNAPSHOT);

        if (cache == null) {
            throw new RuntimeException("Trademark snapshot cache not available");
        }

        TrademarkSnapshot snapshot =
                cache.get(trademarkId, TrademarkSnapshot.class);

        if (snapshot == null) {
            throw new RuntimeException(
                    "Trademark not found (not present in search results): " + trademarkId
            );
        }

        GlobalTrademarkDetailDto dto = mapToDetail(snapshot);

        dto.setBookmarked(
                bookmarkRepository
                        .findByUserIdAndTrademarkId(userId, trademarkId)
                        .isPresent()
        );

        return dto;
    }

    private GlobalTrademarkDetailDto mapToDetail(TrademarkSnapshot s) {

        GlobalTrademarkDetailDto dto = new GlobalTrademarkDetailDto();

        dto.setId(s.getId());
        dto.setMarkName(s.getMarkName());
        dto.setJurisdiction(s.getJurisdiction());

        dto.setFilingDate(s.getFilingDate());
        dto.setStatusCode(s.getStatusCode());
        dto.setDrawingCode(s.getDrawingCode());
        dto.setStandardCharacters(s.getStandardCharacters());
        dto.setOwners(s.getOwners());
        dto.setInternationalClasses(s.getInternationalClasses());
        dto.setGoodsAndServices(s.getGoodsAndServices());

        return dto;
    }


}
