package com.mock.mocktrademarkapi.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"com.mock.mocktrademarkapi"})
public class AppConfig {
    @Bean
    public XmlMapper xmlMapper(){
        return new XmlMapper();
    }
}
