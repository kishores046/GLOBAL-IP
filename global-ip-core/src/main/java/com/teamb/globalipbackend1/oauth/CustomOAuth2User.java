package com.teamb.globalipbackend1.oauth;

import com.teamb.globalipbackend1.model.user.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.List;
import java.util.Map;

public class CustomOAuth2User extends DefaultOAuth2User {

    private final User user;

    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        super(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRoles())),
                attributes,
                "email"
        );
        this.user = user;
    }

    public User getUser() { return user; }
}
