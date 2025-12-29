package com.teamb.globalipbackend1.service.search;



import com.teamb.globalipbackend1.dto.search.*;
import com.teamb.globalipbackend1.external.tmview.TmViewClient;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.trademark.TrademarkSnapshot;
import com.teamb.globalipbackend1.service.trademark.TrademarkSnapshotCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;


@Slf4j
@Service
@RequiredArgsConstructor
public class UnifiedSearchService {

    private final UnifiedPatentSearchService patentSearchService;
    private final TmViewClient tmViewClient;
    private final Executor patentSearchExecutor;
    private final TrademarkSnapshotCacheService trademarkSnapshotCacheService;



    public UnifiedSearchResponse searchByKeyword(GlobalSearchRequest request) {

        log.info("CACHE MISS → executing patent searchByKeyword");

        PatentSearchFilter patentFilter = request.toPatentFilter();
        TrademarkSearchFilter trademarkFilter = request.toTrademarkFilter();

        CompletableFuture<List<PatentDocument>> patentFuture =
                CompletableFuture.supplyAsync(
                        () -> patentSearchService.searchPatentsByKeyword(patentFilter),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Patent searchByKeyword failed", ex);
                    return List.of();
                });



        CompletableFuture<PageResponse<TrademarkResultDto>> trademarkFuture =
                CompletableFuture.supplyAsync(
                        () -> tmViewClient.search(trademarkFilter, 0, 15),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Trademark searchByKeyword failed", ex);
                    return emptyTrademarkPage(0, 15);
                });

        CompletableFuture.allOf(patentFuture, trademarkFuture).join();

        PageResponse<TrademarkResultDto> trademarkPage = trademarkFuture.join();


        trademarkPage.getContent().forEach(dto -> {
            TrademarkSnapshot snapshot = mapToSnapshot(dto);
            trademarkSnapshotCacheService.cache(snapshot);
        });

        return new UnifiedSearchResponse(
                patentFuture.join(),
                trademarkPage.getContent()
        );
    }

    public UnifiedSearchResponse searchAdvanced(GlobalSearchRequest request) {

        log.info("CACHE MISS → executing patent advanced search");


        PatentSearchFilter patentFilter = request.toPatentFilter();
        TrademarkSearchFilter trademarkFilter = request.toTrademarkFilter();

        CompletableFuture<List<PatentDocument>> patentFuture =
                CompletableFuture.supplyAsync(
                        () -> patentSearchService.searchPatentsAdvanced(patentFilter),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Patent searchByKeyword failed", ex);
                    return List.of();
                });


        CompletableFuture<PageResponse<TrademarkResultDto>> trademarkFuture =
                CompletableFuture.supplyAsync(
                        () -> tmViewClient.search(trademarkFilter, 0, 20),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Trademark searchByKeyword failed", ex);
                    return emptyTrademarkPage(0, 15);
                });

        CompletableFuture.allOf(patentFuture, trademarkFuture).join();

        PageResponse<TrademarkResultDto> trademarkPage = trademarkFuture.join();


        trademarkPage.getContent().forEach(dto -> {
            TrademarkSnapshot snapshot = mapToSnapshot(dto);
            trademarkSnapshotCacheService.cache(snapshot);
        });

        return new UnifiedSearchResponse(
                patentFuture.join(),
                trademarkFuture.join().getContent()
        );
    }
    private PageResponse<TrademarkResultDto> emptyTrademarkPage(int page, int size) {
        PageResponse<TrademarkResultDto> resp = new PageResponse<>();
        resp.setContent(List.of());
        resp.setPageNumber(page);
        resp.setPageSize(size);
        resp.setTotalElements(0);
        resp.setTotalPages(0);
        resp.setLast(true);
        return resp;
    }


    private TrademarkSnapshot mapToSnapshot(TrademarkResultDto dto) {

        TrademarkSnapshot snapshot = new TrademarkSnapshot();

        snapshot.setId(dto.getId());
        snapshot.setMarkName(dto.getMarkName());
        snapshot.setFilingDate(dto.getFilingDate());
        snapshot.setStatusCode(dto.getStatusCode());
        snapshot.setDrawingCode(dto.getDrawingCode());
        snapshot.setStandardCharacters(dto.getStandardCharacters());
        snapshot.setOwners(dto.getOwners());
        snapshot.setInternationalClasses(dto.getInternationalClasses());
        snapshot.setGoodsAndServices(dto.getGoodsAndServices());

        return snapshot;
    }




    }


