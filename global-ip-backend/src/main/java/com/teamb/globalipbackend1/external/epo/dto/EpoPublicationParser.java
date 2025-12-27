package com.teamb.globalipbackend1.external.epo.dto;

import org.springframework.stereotype.Component;

@Component
public class EpoPublicationParser {

    public EpoDocumentId parse(String pub) {

        if (pub == null || pub.length() < 6) {
            throw new IllegalArgumentException("Invalid publication number: " + pub);
        }

        String country = pub.substring(0, 2);
        String rest = pub.substring(2);

        String kind = null;
        String number = rest;

        // Detect kind like B1, A1, etc.
        if (rest.matches(".*[A-Z][0-9]$")) {
            kind = rest.substring(rest.length() - 2);
            number = rest.substring(0, rest.length() - 2);
        }

        EpoDocumentId id = new EpoDocumentId();
        id.setCountry(country);
        id.setDocNumber(number);
        id.setKind(kind != null ? kind : "B1"); // fallback

        return id;
    }
}

