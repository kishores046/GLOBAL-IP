package com.teamb.globalipbackend1.oauth;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo get(String provider, Map<String, Object> attributes) {
        provider = provider.toLowerCase();

        return switch (provider) {
            case "google" -> new GoogleOAuth2UserInfo(attributes);
            case "github" -> new GithubOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException(provider + " not supported");
        };
    }
}

