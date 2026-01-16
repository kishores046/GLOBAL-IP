package com.teamb.globalipbackend1.external.usptotm.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "services.trademark")
@Data
public class TrademarkServiceConfig {
    private String baseUrl;
    private String serviceApiKey;
}