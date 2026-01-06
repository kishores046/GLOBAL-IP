package com.teamb.globalipbackend1.dto.citation;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FetchCitationsResponse {
    private String patentId;
    private Boolean success;
    private Integer backwardCount;
    private Integer forwardCount;
    private String message;
}