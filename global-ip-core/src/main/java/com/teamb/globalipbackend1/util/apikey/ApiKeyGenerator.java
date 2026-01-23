package com.teamb.globalipbackend1.util.apikey;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class ApiKeyGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generate() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return "gip_sk_" + Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}