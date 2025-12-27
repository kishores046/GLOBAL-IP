package com.teamb.globalipbackend1.external.patentsview;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.teamb.globalipbackend1.external.patentsview.config.PatentsViewProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
@Slf4j
public class PatentsViewHttpClient {

    private final String API_URL;
    private final String API_KEY;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(120))
            .build();

    public PatentsViewHttpClient(PatentsViewProperties patentsViewProperties) {
        this.API_URL = patentsViewProperties.apiUrl();
        this.API_KEY = patentsViewProperties.apiKey();
        log.info("PatentsView API URL configured: {}", API_URL);
    }

    public String post(String jsonBody) {
        try {
            log.info("Sending request to PatentsView API");
            log.debug("Request body:\n{}", jsonBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .header("Content-Type", "application/json")
                    .header("X-Api-Key", API_KEY)
                    .timeout(Duration.ofSeconds(120))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("PatentsView API response status: {}", response.statusCode());

            if (response.statusCode() != 200) {
                String errorBody = response.body();
                log.error("PatentsView API error response body: {}", errorBody);
                log.error("Request that failed: {}", jsonBody);

                throw new RuntimeException(
                        String.format("PatentsView API error: %d - %s",
                                response.statusCode(),
                                errorBody)
                );
            }

            log.debug("PatentsView API response: {}", response.body().substring(0, Math.min(200, response.body().length())));
            return response.body();

        } catch (Exception e) {
            log.error("PatentsView HTTP call failed", e);
            throw new RuntimeException("PatentsView HTTP call failed", e);
        }
    }
}