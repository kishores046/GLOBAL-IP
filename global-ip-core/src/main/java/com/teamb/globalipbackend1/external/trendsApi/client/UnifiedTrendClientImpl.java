package com.teamb.globalipbackend1.external.trendsApi.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.external.trendsApi.config.PatentAnalyticsServiceConfig;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedCountryTrendDto;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.unified.UnifiedYearTrendDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UnifiedTrendClientImpl implements UnifiedTrendClient {

    private final HttpClient httpClient;
    private final PatentAnalyticsServiceConfig config;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_UNIFIED_FILING")
    public List<UnifiedYearTrendDto> getUnifiedFilingTrend() {
        return get("/unified/trends/filings", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_UNIFIED_COUNTRY")
    public List<UnifiedCountryTrendDto> getUnifiedCountryTrend() {
        return get("/unified/trends/countries", new TypeReference<>() {});
    }



    private <T> T get(String path, TypeReference<T> typeRef) {
        try {
            URI uri = URI.create(config.getBaseUrl() + "/api" + path);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .timeout(Duration.ofSeconds(config.getTimeout()))
                    .header("X-SERVICE-KEY", config.getServiceApiKey())
                    .GET()
                    .build();


            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return objectMapper.readValue(response.body(), typeRef);
            }

            throw new RuntimeException("UnifiedTrendClient failed: " + response.body());

        } catch (Exception e) {
            log.error("Unified trend API failed path={}", path, e);
            throw new RuntimeException(e);
        }
    }
}