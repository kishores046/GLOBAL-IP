package com.teamb.globalipbackend1.external.trendsApi.dto.response.epo;

public record EpoCountryTrendDto(
        String country,
        long patentCount
) {}
