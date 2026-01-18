package com.teamb.globalipbackend1.config;

import com.teamb.globalipbackend1.oauth.CustomerOAuth2UserService;
import com.teamb.globalipbackend1.oauth.OAuth2SuccessHandler;
import com.teamb.globalipbackend1.security.CustomUserDetailsService;
import com.teamb.globalipbackend1.security.JwtAuthFilter;
import com.teamb.globalipbackend1.security.RestAuthenticationEntryPoint;
import com.teamb.globalipbackend1.util.validUtils.valid.Password;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Profile("!test")
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final CustomerOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final PasswordEncoder passwordEncoder;


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.authenticationProvider(authenticationProvider());
        return authBuilder.build();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(restAuthenticationEntryPoint)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/h2-console/**",
                                "/error",
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/api-docs/**"
                        ).permitAll()

                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ANALYST", "ADMIN")
                        .requestMatchers("/api/analyst/**").hasAnyRole("ANALYST", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/patents/**").hasAnyRole("USER","ADMIN","ANALYST")
                        .requestMatchers("/api/search/").hasAnyRole("USER","ADMIN","ANALYST")
                        .requestMatchers("/api/search/advanced").hasAnyRole("ANALYST","ADMIN")
                        .requestMatchers("/api/trademarks/**").hasAnyRole("USER", "ANALYST", "ADMIN")
                        .requestMatchers("/api/role-requests/admin").hasAnyRole("USER","ANALYST","ADMIN")
                        .requestMatchers("/api/role-requests/pending").hasAnyRole("ADMIN")
                        .requestMatchers("/api/role-requests/adminOnly/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/competitors/**").hasAnyRole("ANALYST","ADMIN")
                        .requestMatchers("/api/analyst/trend/**").hasAnyRole("ANALYST", "ADMIN")
                        .requestMatchers("/api/admin/trend/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/trends/trademarks/**").hasAnyRole("ANALYST", "ADMIN")
                        .requestMatchers("/api/monitoring/**").hasAnyRole("ANALYST", "ADMIN")
                        .requestMatchers("/api/subscription/**").hasAnyRole("ANALYST", "ADMIN")
                        .anyRequest().authenticated()
                )

                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(ui -> ui.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}