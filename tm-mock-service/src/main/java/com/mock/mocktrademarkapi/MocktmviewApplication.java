package com.mock.mocktrademarkapi;

import com.mock.mocktrademarkapi.mapper.IngestPropertiesConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.PropertyMapper;

@SpringBootApplication
@EnableConfigurationProperties({IngestPropertiesConfig.class})
public class MocktmviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(MocktmviewApplication.class, args);
    }

}
