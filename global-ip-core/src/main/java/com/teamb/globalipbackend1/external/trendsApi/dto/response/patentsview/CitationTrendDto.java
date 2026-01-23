package com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview;

public record CitationTrendDto(
        String patentId,
        Long timesCited
) {}