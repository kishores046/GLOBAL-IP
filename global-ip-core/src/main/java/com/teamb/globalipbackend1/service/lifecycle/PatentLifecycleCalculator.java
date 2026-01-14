package com.teamb.globalipbackend1.service.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;

import java.time.LocalDate;

public class PatentLifecycleCalculator {

    public static ApplicationLifecycleDto compute(
            String publicationNumber,
            LocalDate filingDate,
            LocalDate grantDate,
            LocalDate expirationDate,
            boolean withdrawn
    ) {

        String status;

        if (withdrawn) {
            status = "WITHDRAWN";
        } else if (expirationDate != null && expirationDate.isBefore(LocalDate.now())) {
            status = "EXPIRED";
        } else if (grantDate != null) {
            status = "GRANTED";
        } else if (filingDate != null) {
            status = "PENDING";
        } else {
            status = "UNKNOWN";
        }

        return new ApplicationLifecycleDto(
                publicationNumber,
                filingDate,
                grantDate,
                expirationDate,
                status
        );
    }
}
