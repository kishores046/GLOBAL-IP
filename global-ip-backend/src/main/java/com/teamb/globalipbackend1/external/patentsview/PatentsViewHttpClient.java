package com.teamb.globalipbackend1.external.patentsview;

import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.external.patentsview.config.PatentsViewProperties;
import lombok.extern.slf4j.Slf4j;
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


    @TrackApiUsage(service = "USPTO", action = "POST")
    public String post(String endpoint, String jsonBody) {
        try {
            log.info("POST to: {}", endpoint);
            log.info("Request body: {}", jsonBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .header("Content-Type", "application/json")
                    .header("X-Api-Key", API_KEY)
                    .timeout(Duration.ofSeconds(120))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            log.info("API response status: {}", response.statusCode());

            if (response.statusCode() != 200) {
                log.error("API error response body: {}", response.body());
                log.error("Failed request body: {}", jsonBody);
                throw new RuntimeException("API error: " + response.statusCode() + " - " + response.body());
            }

            return response.body();

        } catch (Exception e) {
            log.error("HTTP call failed to {}", endpoint, e);
            throw new RuntimeException("HTTP call failed", e);
        }
    }

    // Keep your existing post() method for backward compatibility
    @TrackApiUsage(service = "USPTO", action = "POST")
    public String post(String jsonBody) {
        return post(API_URL, jsonBody);
    }
}
