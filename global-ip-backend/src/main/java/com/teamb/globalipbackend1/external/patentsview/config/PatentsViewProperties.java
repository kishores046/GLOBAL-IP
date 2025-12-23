package com.teamb.globalipbackend1.external.patentsview.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "patentsview")
public record PatentsViewProperties(
        @NotNull @NotBlank String apiUrl,
        @NotNull @NotBlank String apiKey
) {}
