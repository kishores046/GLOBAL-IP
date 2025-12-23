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

    public PatentsViewHttpClient(PatentsViewProperties patentsViewProperties) {
        this.API_URL= patentsViewProperties.apiUrl();
        this.API_KEY= patentsViewProperties.apiKey();
    }

    private  final String API_URL ;
    private final String API_KEY;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(1200))
            .build();

    public String post(String jsonBody) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .header("Content-Type", "application/json")
                    .header("X-API-Key", API_KEY)
                    .timeout(Duration.ofSeconds(1200))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                        "PatentsView API error: " + response.statusCode()
                );
            }


            log.info("PatentsView");
            return response.body();

        } catch (Exception e) {
            throw new RuntimeException("PatentsView HTTP call failed", e);
        }
    }
}
