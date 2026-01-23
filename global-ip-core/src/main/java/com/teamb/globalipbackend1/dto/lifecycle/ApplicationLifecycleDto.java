package com.teamb.globalipbackend1.dto.lifecycle;



import java.time.LocalDate;

public record ApplicationLifecycleDto(
        String publicationNumber,
        LocalDate filingDate,
        LocalDate grantDate,
        LocalDate expirationDate,
        String status
) {}

