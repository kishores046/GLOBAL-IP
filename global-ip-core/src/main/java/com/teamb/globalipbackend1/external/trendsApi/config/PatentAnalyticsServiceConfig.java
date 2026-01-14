package com.teamb.globalipbackend1.external.trendsApi.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "patent.service")
@Data
public class PatentAnalyticsServiceConfig {
    private String baseUrl = "http://localhost:8081";
    private String apiPath = "/api/trends";
    private int timeout = 180;
    private int maxRetries = 3;
}