package com.teamb.globalipbackend1.external.trendsApi.dto.response.patentsview;

public record AssigneeTechnologyFocusDto(
        String assignee,
        String cpcSection,
        Long patentCount
) {}
