package com.teamb.globalipbackend1.oauth;

import com.teamb.globalipbackend1.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;

import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();

        String token = jwtUtil.generateToken(
                new org.springframework.security.core.userdetails.User(
                        oauthUser.getUser().getEmail(),
                        "",
                        oauthUser.getAuthorities()
                )
        );

        response.sendRedirect("http://localhost:3000/oauth/success?token=" + token);
    }
}
