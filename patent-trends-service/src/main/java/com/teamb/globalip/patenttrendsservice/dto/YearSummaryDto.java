package com.teamb.globalip.patenttrendsservice.dto;

public record YearSummaryDto(
        Integer year,
        Long filings,
        Long grants,
        Double avgTimeToGrant
) {}