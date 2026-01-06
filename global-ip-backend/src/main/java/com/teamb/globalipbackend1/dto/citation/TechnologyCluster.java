package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyCluster {
    private String clusterId;
    private String clusterName;
    private List<String> patentIds;
    private Integer size;
    private String color;
}