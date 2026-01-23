package com.teamb.globalipbackend1.external.usptotm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.trademark.trend.CodeDistributionDto;
import com.teamb.globalipbackend1.dto.trademark.trend.SimpleCountDto;
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
import java.util.Map;

@Slf4j
@Component

public class TrademarkTrendClient {
    private  final TrademarkServiceConfig config;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;


    public TrademarkTrendClient(
            TrademarkServiceConfig config, @Qualifier("jsonObjectMapper") ObjectMapper objectMapper
    ) {
        this.config = config;
        this.objectMapper = objectMapper;
    }


    @TrackApiUsage(
            service = "TRADEMARK_TRENDS",
            action = "SUMMARY"
    )
    @Cacheable(cacheNames = CacheNames.TRADEMARK_SEARCH)
    public Map<String, Object> getSummary() {
        return get("/api/trends/trademarks/summary",
                new TypeReference<>() {});
    }

    @TrackApiUsage(
            service = "TRADEMARK_TRENDS",
            action = "TOP_CLASSES"
    )
    public List<CodeDistributionDto> topClasses() {
        return get("/api/trends/trademarks/classes/top",
                new TypeReference<>() {});
    }


    @TrackApiUsage(
            service = "TRADEMARK_TRENDS",
            action = "TOP_COUNTRIES"
    )
    public List<SimpleCountDto> topCountries() {
        return get("/api/trends/trademarks/countries/top",
                new TypeReference<>() {});
    }

    @TrackApiUsage(
            service = "TRADEMARK_TRENDS",
            action = "STATUS_DISTRIBUTION"
    )
    public List<SimpleCountDto> statusDistribution() {
        return get("/api/trends/trademarks/status",
                new TypeReference<>() {});
    }

    private <T> T get(String path, TypeReference<T> type) {
        try {
            URI uri = URI.create(config.getBaseUrl() + path);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("X-SERVICE-KEY", config.getServiceApiKey())
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Trademark trend fetch failed: " + path);
            }

            return objectMapper.readValue(response.body(), type);

        } catch (Exception e) {
            log.error("Trademark trend API error {}", path, e);
            throw new RuntimeException(e);
        }
    }
}