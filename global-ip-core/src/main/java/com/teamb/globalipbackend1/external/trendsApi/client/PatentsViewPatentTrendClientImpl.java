package com.teamb.globalipbackend1.external.trendsApi.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.external.trendsApi.config.PatentAnalyticsServiceConfig;
import com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview.*;
import com.teamb.globalipbackend1.external.trendsApi.exception.PatentServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Component
@RequiredArgsConstructor
@Slf4j
public class PatentsViewPatentTrendClientImpl implements PatentTrendClient {

    private final HttpClient httpClient;
    private final PatentAnalyticsServiceConfig config;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());


    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_FILING")
    public List<FilingTrendDto> getFilingTrend() {
        return get("/filings", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_GRANT")
    public List<GrantTrendDto> getGrantTrend() {
        return get("/grants", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_TECHNOLOGY_TOP")
    public List<TechnologyTrendDto> getTopTechnologies(int limit) {
        return get("/technologies/top?limit=" + limit, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_ASSIGNEE_TOP")
    public List<AssigneeTrendDto> getTopAssignees(int limit) {
        return get("/assignees/top?limit=" + limit, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_CITATION_TOP_CITED")
    public List<CitationTrendDto> getTopCitedPatents(int limit) {
        return get("/citations/top-cited?limit=" + limit, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_TECHNOLOGY_EVOLUTION")
    public List<TechnologyEvolutionDto> getTechnologyEvolution() {
        return get("/technologies/evolution", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_CITATION_TOP_CITING")
    public List<CitationMetricDto> getTopCitingPatents(int limit) {
        return get("/citations/top-citing?limit=" + limit, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_CITATION_LAG")
    public List<CitationLagDto> getCitationLagTrend() {
        return get("/citations/lag", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_PATENT_TYPE")
    public List<PatentTypeDto> getPatentTypeDistribution() {
        return get("/patents/type-distribution", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_CLAIM_COMPLEXITY")
    public List<ClaimComplexityDto> getClaimComplexityTrend() {
        return get("/patents/claim-complexity", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_TIME_TO_GRANT")
    public List<TimeToGrantDto> getTimeToGrantTrend() {
        return get("/patents/time-to-grant", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_YEAR_SUMMARY")
    public YearSummaryDto getYearSummary(int year) {
        return get("/summary/" + year, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_FILING")
    public CompletableFuture<List<FilingTrendDto>> getFilingTrendAsync() {
        return getAsync("/filings", new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_YEAR_SUMMARY")
    public CompletableFuture<YearSummaryDto> getYearSummaryAsync(int year) {
        return getAsync("/summary/" + year, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_COUNTRY")
    public List<GeographicTrendDto> getTopCountries(LocalDate startDate, int limit) {
        String url = UriComponentsBuilder
                .fromPath("/countries")
                .queryParam("startDate", startDate)
                .queryParam("limit", limit)
                .toUriString();

        return get(url, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_TECHNOLOGY_CROSSOVER")
    public List<TechnologyCrossoverDto> getTechnologyCrossovers(int minCount, int limit) {
        return get(
                "/technologies/crossovers?minCount=" + minCount + "&limit=" + limit,
                new TypeReference<>() {}
        );
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_ASSIGNEE_INNOVATION")
    public Map<String, List<AssigneeActivityDto>> getInnovationVelocity(
            List<String> assignees, int yearStart, int yearEnd) {

        String url = String.format(
                "/assignees/innovation-velocity?assignees=%s&yearStart=%d&yearEnd=%d",
                String.join(",", assignees),
                yearStart,
                yearEnd
        );

        return get(url, new TypeReference<>() {});
    }

    @Override
    @TrackApiUsage(service = "TRENDS", action = "TREND_ASSIGNEE_TECH_FOCUS")
    public List<AssigneeTechnologyFocusDto> getAssigneeTechnologyFocus(
            String assigneeName, int limit) {

        return get(
                "/assignees/technology-focus?assigneeName=" + assigneeName + "&limit=" + limit,
                new TypeReference<>() {}
        );
    }

    private <T> T get(String path, TypeReference<T> typeRef) {
        return withRetry(() -> {
            try {
                URI uri = buildUri(path);

                HttpRequest request = baseRequest(uri)
                        .GET()
                        .build();

                HttpResponse<String> response =
                        httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                return handleResponse(response, typeRef);

            } catch (Exception e) {
                throw new RuntimeException(new PatentServiceException("GET failed for " + path, e));
            }
        });
    }

    private <T, R> R post(String path, T body, TypeReference<R> typeRef) {
        return withRetry(() -> {
            try {
                URI uri = buildUri(path);
                String json = objectMapper.writeValueAsString(body);

                HttpRequest request = baseRequest(uri)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();

                HttpResponse<String> response =
                        httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                return handleResponse(response, typeRef);

            } catch (Exception e) {
                throw new RuntimeException(new PatentServiceException("POST failed for " + path, e));
            }
        });
    }

    private <T> CompletableFuture<T> getAsync(String path, TypeReference<T> typeRef) {
        URI uri = buildUri(path);

        HttpRequest request = baseRequest(uri)
                .GET()
                .build();

        return httpClient
                .sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .orTimeout(config.getTimeout(), TimeUnit.SECONDS)
                .thenApply(response -> handleResponse(response, typeRef));
    }

    /* ===================== SHARED HELPERS ===================== */

    private HttpRequest.Builder baseRequest(URI uri) {
        return HttpRequest.newBuilder()
                .uri(uri)
                .timeout(Duration.ofSeconds(config.getTimeout()))
                .header("X-SERVICE-KEY", config.getServiceApiKey());
    }

    private URI buildUri(String path) {
        return URI.create(config.getBaseUrl() + config.getApiPath() + path);
    }

    private <T> T handleResponse(HttpResponse<String> response, TypeReference<T> typeRef) {

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            try {
                return objectMapper.readValue(response.body(), typeRef);
            } catch (Exception e) {
                throw new RuntimeException(
                        new PatentServiceException("Failed to parse response", e));
            }
        }

        throw new RuntimeException(
                new PatentServiceException("HTTP " + response.statusCode()));
    }

    private <T> T withRetry(Supplier<T> supplier) {
        int attempts = 0;

        while (true) {
            try {
                return supplier.get();
            } catch (Exception ex) {
                attempts++;
                if (attempts >= config.getMaxRetries()) {
                    throw ex;
                }
                try {
                    Thread.sleep(500L * attempts);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(
                            new PatentServiceException("Retry interrupted", ie));
                }
            }
        }
    }
}