package com.teamb.globalipbackend1.service.patent.lifecycle;

import java.time.LocalDate;

public final class PatentExpiryCalculator {

    private static final int STANDARD_TERM_YEARS = 20;

    private PatentExpiryCalculator() {}

    /**
     * EPO / TRIPS standard:
     * Patent expires 20 years from the earliest filing date.
     */
    public static LocalDate computeExpiry(LocalDate filingDate) {
        if (filingDate == null) {
            return null;
        }
        return filingDate.plusYears(STANDARD_TERM_YEARS);
    }
}
