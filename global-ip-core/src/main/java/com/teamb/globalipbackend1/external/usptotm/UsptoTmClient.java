package com.teamb.globalipbackend1.external.usptotm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.search.PageResponse;
import com.teamb.globalipbackend1.dto.search.TrademarkResultDto;
import com.teamb.globalipbackend1.dto.search.TrademarkSearchFilter;
import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.external.usptotm.config.TrademarkServiceConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Component

@Slf4j
public class UsptoTmClient {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final TrademarkServiceConfig config;
    @Qualifier("jsonObjectMapper")
    private final ObjectMapper objectMapper;

    @Value("${services.trademark.base-url}")
    private String trademarkBaseUrl;

    public UsptoTmClient(TrademarkServiceConfig config, @Qualifier("jsonObjectMapper") ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
    }

    @TrackApiUsage(
            service = "TRADEMARK",
            action = "SEARCH"
    )
    @Cacheable(
            cacheNames = CacheNames.TRADEMARK_SEARCH,
            key = "T(java.util.Objects).hash("
                    + "#filter.goodsAndServicesText,"
                    + "#filter.markName,"
                    + "#filter.country,"
                    + "#filter.state,"
                    + "#filter.filingDateFrom,"
                    + "#filter.filingDateTo)"
    )

    public PageResponse<TrademarkResultDto> search(
            TrademarkSearchFilter filter,
            int page,
            int size) {

        try {
            URI uri = URI.create(
                    trademarkBaseUrl + "/api/trademarks/search?page=" + page + "&size=" + size
            );

            log.info("CACHE MISS → executing patent searchByKeyword");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Content-Type", "application/json")
                    .header("X-SERVICE-KEY", config.getServiceApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(
                            objectMapper.writeValueAsString(filter)
                    ))
                    .build();
            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Trademark service returned {}", response.statusCode());
                return emptyPage(page, size);
            }

            return objectMapper.readValue(
                    response.body(),
                    new TypeReference<PageResponse<TrademarkResultDto>>() {}
            );

        } catch (Exception e) {
            log.error("Trademark searchByKeyword failed", e);
            return emptyPage(page, size);
        }
    }

    @TrackApiUsage(
            service = "TRADEMARK",
            action = "DETAIL"
    )

    public GlobalTrademarkDetailDto fetchTrademarkDetail(String trademarkId) {
        try {
            URI uri = URI.create(
                    trademarkBaseUrl + "/api/trademarks/" + trademarkId
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("X-SERVICE-KEY", config.getServiceApiKey())
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Trademark detail fetch failed: {}", response.statusCode());
                return null;
            }

            return objectMapper.readValue(
                    response.body(),
                    GlobalTrademarkDetailDto.class
            );

        } catch (Exception e) {
            log.error("Failed to fetch trademark detail {}", trademarkId, e);
            return null;
        }
    }

    private PageResponse<TrademarkResultDto> emptyPage(int page, int size) {
        PageResponse<TrademarkResultDto> p = new PageResponse<>();
        p.setContent(List.of());
        p.setPageNumber(page);
        p.setPageSize(size);
        p.setTotalElements(0);
        p.setTotalPages(0);
        p.setLast(true);
        return p;
    }
}
