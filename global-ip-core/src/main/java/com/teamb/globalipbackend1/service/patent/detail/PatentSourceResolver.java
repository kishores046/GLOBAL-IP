package com.teamb.globalipbackend1.service.patent.detail;


import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class PatentSourceResolver {

    /**
     * Returns true if the publication should be fetched via EPO OPS.
     * EPO supports most non-US jurisdictions (EP, WO, KR, JP, AU, FI, LU, LT, UA, etc.)
     */
    public boolean isEpoPatent(String publicationNumber) {
        if (publicationNumber == null || publicationNumber.isBlank()) {
            return false;
        }

        String normalized = publicationNumber.trim().toUpperCase(Locale.ROOT);

        // US patents → PatentsView
        if (normalized.startsWith("US")) {
            return false;
        }

        // Pure numeric → assume USPTO → PatentsView
        if (normalized.matches("\\d+")) {
            return false;
        }

        // Everything else → EPO OPS
        return true;
    }

    /**
     * Returns true if publication should be fetched via PatentsView.
     */
    public boolean isUsPatent(String publicationNumber) {
        if (publicationNumber == null || publicationNumber.isBlank()) {
            return false;
        }

        String normalized = publicationNumber.trim().toUpperCase(Locale.ROOT);

        return normalized.startsWith("US") || normalized.matches("\\d+");
    }
}
