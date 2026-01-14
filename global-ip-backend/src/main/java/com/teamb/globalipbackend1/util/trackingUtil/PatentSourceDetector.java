package com.teamb.globalipbackend1.util.trackingUtil;

import org.springframework.stereotype.Component;

/**
 * Utility to detect patent source (USPTO or EPO) based on patent ID format
 */
@Component
public class PatentSourceDetector {

    public enum PatentSource {
        USPTO,
        EPO,
        UNKNOWN
    }

    /**
     * Detect patent source from patent ID
     *
     * Examples:
     * - "EP1234567B1" → EPO
     * -"LU/WO/JP/KR/FR/EP/ES123444"->EPO
     * - "US10123456B2" → USPTO
     * - "10123456" → USPTO (PatentsView format)
     * - "12345678" → USPTO
     */
    public PatentSource detectSource(String patentId) {
        if (patentId == null || patentId.isBlank()) {
            return PatentSource.UNKNOWN;
        }

        String normalized = patentId.trim().toUpperCase();

        // EPO patents start with "EP"
        if (normalized.startsWith("EP")) {
            return PatentSource.EPO;
        }

        // USPTO patents
        // Can start with "US" or be just numbers (PatentsView format)
        if (normalized.startsWith("US")) {
            return PatentSource.USPTO;
        }

        // If it's all numbers or numbers with kind code, assume USPTO
        // PatentsView format: "10123456" or "10123456B2"
        if (normalized.matches("^\\d{7,8}[A-Z]?\\d?$")) {
            return PatentSource.USPTO;
        }

        return PatentSource.EPO;
    }

    /**
     * Check if patent is from EPO
     */
    public boolean isEpoPatent(String patentId) {
        return detectSource(patentId) == PatentSource.EPO;
    }

    /**
     * Check if patent is from USPTO
     */
    public boolean isUsPatent(String patentId) {
        return detectSource(patentId) == PatentSource.USPTO;
    }
}















