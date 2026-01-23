package com.teamb.globalipbackend1.external.trendsApi.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;



@ConfigurationProperties(prefix = "patent-analytics")
@Data
public class PatentAnalyticsServiceConfig {
    private String baseUrl ;
    private String apiPath ;
    private int timeout;
    private int maxRetries ;
    private String serviceApiKey;


    @PostConstruct
    void validate() {
        if (baseUrl == null || baseUrl.isBlank()) {
            throw new IllegalStateException("patent-analytics.base-url is not configured");
        }
        if (apiPath == null || apiPath.isBlank()) {
            throw new IllegalStateException("patent-analytics.api-path is not configured");
        }
        if (serviceApiKey == null || serviceApiKey.isBlank()) {
            throw new IllegalStateException("TREND_SERVICE_API_KEY is missing");
        }
    }

}