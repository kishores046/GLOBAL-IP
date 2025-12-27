package com.teamb.globalipbackend1.service.trademark;



import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.external.tmview.TmViewClient;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrademarkDetailService {

    private final TmViewClient trademarkClient; // TMView / mock
    private final TrademarkBookmarkRepository bookmarkRepository;

    public GlobalTrademarkDetailDto getTrademarkDetail(
            String trademarkId,
            String userId
    ) {


        GlobalTrademarkDetailDto dto =
                trademarkClient.fetchTrademarkDetail(trademarkId);

        if (dto == null) {
            throw new RuntimeException("Trademark not found: " + trademarkId);
        }


        boolean bookmarked =
                bookmarkRepository
                        .findByUserIdAndTrademarkId(userId, trademarkId)
                        .isPresent();

        dto.setBookmarked(bookmarked);
        return dto;
    }
}
