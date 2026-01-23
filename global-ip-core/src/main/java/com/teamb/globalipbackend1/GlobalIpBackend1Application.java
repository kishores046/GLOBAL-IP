package com.teamb.globalipbackend1;

import com.teamb.globalipbackend1.external.epo.config.EpoProperties;
import com.teamb.globalipbackend1.external.patentsview.config.PatentsViewProperties;
import com.teamb.globalipbackend1.external.trendsApi.config.PatentAnalyticsServiceConfig;
import com.teamb.globalipbackend1.security.JwtConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties({EpoProperties.class, PatentsViewProperties.class, PatentAnalyticsServiceConfig.class})
@EnableScheduling
public class GlobalIpBackend1Application {

    public static void main(String[] args) {
        SpringApplication.run(GlobalIpBackend1Application.class, args);
    }


}
