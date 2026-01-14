package com.teamb.globalip.patenttrendsservice;

import com.teamb.globalip.patenttrendsservice.ingest.IngestProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({IngestProperties.class})
public class PatentTrendsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatentTrendsServiceApplication.class, args);
    }

}
