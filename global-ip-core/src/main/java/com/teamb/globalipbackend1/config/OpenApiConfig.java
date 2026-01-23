package com.teamb.globalipbackend1.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Setter
@Configuration
@ConfigurationProperties(prefix = "server")
public class OpenApiConfig {

    private String port;

    @Bean
    public OpenAPI globalIpOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Global IP Intelligence Backend API")
                        .description("""
                                REST API for searching and managing patents and trademarks.
                                Integrates with EPO, PatentsView, and TMView.
                                Secured using JWT and API Key authentication.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Team B - Global IP Backend Team")
                                .email("kishore279k@gmail.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + port)
                                .description("Development Server")
                ))

                //Global security requirement: JWT + API Key
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication")
                        .addList("ApiKey Authentication")
                )

                // 🔧 Security scheme definitions
                .components(new Components()
                        // JWT
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description(
                                                "Enter JWT token like: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                        )
                        )

                        // API Key
                        .addSecuritySchemes("ApiKey Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-API-KEY")
                                        .description("API key required for programmatic and analytics access")
                        )
                );
    }
}
