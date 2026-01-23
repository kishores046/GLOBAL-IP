package com.teamb.globalipbackend1.dto.competitor;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorDTO {
    private Long id;
    private String code;
    private String displayName;
    private List<String> assigneeNames;
    private Boolean active;
    private String description;
    private String industry;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long totalFilings;
    private String jurisdiction;
}
