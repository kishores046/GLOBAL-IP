package com.teamb.globalipbackend1.dto.citation;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitationCountResponse {
    private String patentId;
    private Integer backwardCitations;
    private Integer forwardCitations;
    private Integer totalCitations;
    private Boolean hasForwardCitations;
    private String message;
}