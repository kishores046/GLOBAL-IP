package com.teamb.globalip.patenttrendsservice.dto;

public record CitationTrendDto(
        String patentId,
        Long timesCited
) {}