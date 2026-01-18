package com.teamb.globalipbackend1.dto.competitor;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorCreateRequest {
    private String code;
    private String displayName;
    private List<String> assigneeNames;
    private String description;
    private String industry;
    /**
     * US, EP, BOTH
     */
    private String jurisdiction;
}