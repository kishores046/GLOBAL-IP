package com.teamb.globalipbackend1;

import com.teamb.globalipbackend1.security.JwtConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtConfig.class)

public class GlobalIpBackend1Application {

    public static void main(String[] args) {
        SpringApplication.run(GlobalIpBackend1Application.class, args);
    }


}
