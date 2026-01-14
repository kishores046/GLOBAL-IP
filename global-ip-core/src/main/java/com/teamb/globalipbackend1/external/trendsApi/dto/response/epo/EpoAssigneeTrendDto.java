package com.teamb.globalipbackend1.external.trendsApi.dto.response.epo;

public record EpoAssigneeTrendDto(
        String organization,
        long patentCount
) {}