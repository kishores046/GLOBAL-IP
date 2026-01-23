package com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview;

public record FilingTrendDto(
        Integer year,
        Long filings
) {}