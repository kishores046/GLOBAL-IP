package com.teamb.globalipbackend1.external.epo.config;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "epo")
public record EpoProperties (
    @NotNull @NotBlank  String baseUrl,
    @NotNull @NotBlank  String consumerKey,
    @NotNull @NotBlank  String consumerSecret
){}

