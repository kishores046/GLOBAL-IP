package com.teamb.globalip.patenttrendsservice.ingest;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring")
@Getter
@Setter
public class IngestProperties {

    private String filepath;
}