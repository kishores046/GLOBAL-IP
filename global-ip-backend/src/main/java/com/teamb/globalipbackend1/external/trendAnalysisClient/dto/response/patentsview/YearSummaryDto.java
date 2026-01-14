package com.teamb.globalipbackend1.external.trendAnalysisClient.dto.response.patentsview;

public record YearSummaryDto(
        Integer year,
        Long filings,
        Long grants,
        Double avgTimeToGrant
) {}