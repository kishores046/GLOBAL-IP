package com.teamb.globalipbackend1.util.apikey;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyHasher {

    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public String hash(String rawKey) {
        return encoder.encode(rawKey);
    }

    public boolean matches(String rawKey, String hash) {
        return encoder.matches(rawKey, hash);
    }
}
