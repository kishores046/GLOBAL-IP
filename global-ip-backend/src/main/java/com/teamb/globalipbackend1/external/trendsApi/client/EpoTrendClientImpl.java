package com.teamb.globalipbackend1.external.trendsApi.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.external.trendsApi.config.PatentAnalyticsServiceConfig;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.epo.*;
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
public class EpoTrendClientImpl implements EpoTrendClient {

    private final HttpClient httpClient;
    private final PatentAnalyticsServiceConfig config;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<EpoYearCountDto> getFilingTrend() {
        return get("/epo/trends/filings", new TypeReference<>() {});
    }

    @Override
    public List<EpoCountryTrendDto> getCountryDistribution() {
        return get("/epo/trends/countries", new TypeReference<>() {});
    }

    @Override
    public List<EpoTechnologyTrendDto> getTopTechnologies() {
        return get("/epo/trends/technologies", new TypeReference<>() {});
    }

    @Override
    public List<EpoAssigneeTrendDto> getTopAssignees() {
        return get("/epo/trends/assignees", new TypeReference<>() {});
    }

    @Override
    public List<EpoFamilyTrendDto> getFamilySizeTrend() {
        return get("/epo/trends/families", new TypeReference<>() {});
    }

    private <T> T get(String path, TypeReference<T> typeRef) {
        try {
            URI uri = URI.create(config.getBaseUrl() + "/api" + path);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .timeout(Duration.ofSeconds(config.getTimeout()))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return objectMapper.readValue(response.body(), typeRef);
            }

            throw new RuntimeException("EPO Trend API failed: " + response.body());

        } catch (Exception e) {
            log.error("EPO trend API failed path={}", path, e);
            throw new RuntimeException(e);
        }
    }
}
