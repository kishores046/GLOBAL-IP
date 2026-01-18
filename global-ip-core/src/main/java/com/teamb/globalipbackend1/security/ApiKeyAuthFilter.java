package com.teamb.globalipbackend1.security;

import com.teamb.globalipbackend1.model.user.ApiKey;
import com.teamb.globalipbackend1.service.user.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private final ApiKeyService service;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String apiKey = request.getHeader("X-API-KEY");

        if (apiKey != null) {
            ApiKey key = service.validate(apiKey);
            key.setLastUsedAt(LocalDateTime.now());
        }

        chain.doFilter(request, response);
    }
}
