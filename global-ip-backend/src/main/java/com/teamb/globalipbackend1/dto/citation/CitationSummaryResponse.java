package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitationSummaryResponse {
    private String patentId;
    private Integer backwardCitations;
    private Integer forwardCitations;
    private Integer totalNodes;
    private Integer totalEdges;
    private Integer depth;
    private List<String> insights;
    private NetworkMetrics metrics;
}

