package com.teamb.globalipbackend1.service.patent.search;



import com.teamb.globalipbackend1.dto.search.*;
import com.teamb.globalipbackend1.external.usptotm.UsptoTmClient;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
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
    private final UsptoTmClient usptoTmClient;
    private final Executor patentSearchExecutor;

    public UnifiedSearchResponse searchByKeyword(GlobalSearchRequest request) {

        log.info("CACHE MISS → executing patent searchByKeyword");

        PatentSearchFilter patentFilter = request.toPatentFilter();
        TrademarkSearchFilter trademarkFilter = request.toTrademarkFilter();

        CompletableFuture<List<PatentDocument>> patentFuture =
                CompletableFuture.supplyAsync(
                        () -> patentSearchService.searchByKeyword(patentFilter),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Patent searchByKeyword failed", ex);
                    return List.of();
                });



        CompletableFuture<PageResponse<TrademarkResultDto>> trademarkFuture =
                CompletableFuture.supplyAsync(
                        () -> usptoTmClient.search(trademarkFilter, 0, 15),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Trademark searchByKeyword failed", ex);
                    return emptyTrademarkPage(0, 15);
                });

        CompletableFuture.allOf(patentFuture, trademarkFuture).join();


        return new UnifiedSearchResponse(
                patentFuture.join(),
                trademarkFuture.join().getContent()
        );
    }

    public UnifiedSearchResponse searchAdvanced(GlobalSearchRequest request) {

        log.info("CACHE MISS → executing patent advanced search");


        PatentSearchFilter patentFilter = request.toPatentFilter();
        TrademarkSearchFilter trademarkFilter = request.toTrademarkFilter();

        CompletableFuture<List<PatentDocument>> patentFuture =
                CompletableFuture.supplyAsync(
                        () -> patentSearchService.searchAdvanced(patentFilter),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Patent searchByKeyword failed", ex);
                    return List.of();
                });


        CompletableFuture<PageResponse<TrademarkResultDto>> trademarkFuture =
                CompletableFuture.supplyAsync(
                        () -> usptoTmClient.search(trademarkFilter, 0, 20),
                        patentSearchExecutor
                ).exceptionally(ex -> {
                    log.error("Trademark searchByKeyword failed", ex);
                    return emptyTrademarkPage(0, 15);
                });

        CompletableFuture.allOf(patentFuture, trademarkFuture).join();

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
}


