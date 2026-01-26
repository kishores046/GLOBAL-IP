package com.mock.mocktrademarkapi.mapper;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("ingest")
@ConfigurationProperties(prefix = "ingest")
@Configuration
@Getter @Setter
public class IngestPropertiesConfig {
    private String filePath;
}
