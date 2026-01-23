package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitationNetworkResponse {
    private List<PatentNode> nodes;
    private List<CitationEdge> edges;
    private NetworkMetrics metrics;
    private Map<String, TechnologyCluster> clusters;
}