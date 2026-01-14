package com.teamb.globalip.patenttrendsservice.dto;

public record AssigneeTechnologyFocusDto(
        String assignee,
        String cpcSection,
        Long patentCount
) {}
