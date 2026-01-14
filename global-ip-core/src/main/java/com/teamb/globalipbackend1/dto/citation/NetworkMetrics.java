package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NetworkMetrics {
    private Integer totalNodes;
    private Integer totalEdges;
    private Double citationDensity;
    private Double averageCitationsPerPatent;
    private String mostCitedPatent;
    private Integer mostCitedCount;
    private Integer numberOfClusters;
    private Map<String, Integer> assigneeDistribution;
    private Map<String, Integer> technologyDistribution;
    private Map<Integer, Integer> citationsByYear;
}
