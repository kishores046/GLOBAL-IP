package com.teamb.globalipbackend1.service.trademark;



import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.teamb.globalipbackend1.dto.lifecycle.TrademarkLifecycleDto;
import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.external.usptotm.UsptoTmClient;
import com.teamb.globalipbackend1.repository.bookmark.TrademarkBookmarkRepository;
import com.teamb.globalipbackend1.service.lifecycle.TrademarkLifecycleCalculator;
import com.teamb.globalipbackend1.service.patent.lifecycle.TrademarkLifecyclePersistenceService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrademarkDetailService {

    private final UsptoTmClient trademarkClient;
    private final TrademarkBookmarkRepository bookmarkRepository;
    private final TrademarkLifecyclePersistenceService lifecyclePersistenceService;
    private final LoadingCache<@NonNull String,GlobalTrademarkDetailDto> trademarkDetailDtoLoadingCache=
            Caffeine.newBuilder()
                    .expireAfterWrite(6, TimeUnit.HOURS)
                    .maximumSize(10_000)
                    .recordStats()
                    .removalListener(((key, value, cause) -> log.info("Trademark {} removed due to {}",key,cause)))
                    .build(this::loadTradeMarkDetail);

    public GlobalTrademarkDetailDto getTrademarkDetail(
            String trademarkId,
            String userId
    ) {

        GlobalTrademarkDetailDto dto = trademarkDetailDtoLoadingCache.get(trademarkId);
        if (dto == null) {
            throw new RuntimeException("No trademark found by id: " + trademarkId);
        }

        String lifecycleStatus =
                TrademarkLifecycleCalculator.computeStatus(dto.getStatusCode());

        TrademarkLifecycleDto lifecycle =
                new TrademarkLifecycleDto(
                        trademarkId,
                        dto.getFilingDate(),
                        lifecycleStatus,
                        dto.getStatusCode()
                );

        lifecyclePersistenceService.save(userId, lifecycle);

        if (dto!=null){
            dto.setBookmarked(
                    bookmarkRepository
                            .findByUserIdAndTrademarkId(userId, trademarkId)
                            .isPresent()
            );
        }

        else throw new RuntimeException("No trademark found by id");
        return dto;
    }

    private GlobalTrademarkDetailDto loadTradeMarkDetail(String trademarkId){
        return trademarkClient.fetchTrademarkDetail(trademarkId);
    }

    public TrademarkLifecycleDto computeAndPersistLifecycle(
            String trademarkId,
            String userId
    ) {

        GlobalTrademarkDetailDto dto =
                trademarkDetailDtoLoadingCache.get(trademarkId);

        if (dto == null) {
            throw new RuntimeException("Trademark not found: " + trademarkId);
        }

        String lifecycleStatus =
                TrademarkLifecycleCalculator.computeStatus(dto.getStatusCode());

        TrademarkLifecycleDto lifecycle =
                new TrademarkLifecycleDto(
                        trademarkId,
                        dto.getFilingDate(),
                        lifecycleStatus,
                        dto.getStatusCode()
                );

        lifecyclePersistenceService.save(userId, lifecycle);

        return lifecycle;
    }

}
