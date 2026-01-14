package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatentNode {
    private String patentId;
    private String title;
    private String abstractText;
    private String assignee;
    private LocalDate filingDate;
    private LocalDate grantDate;
    private List<String> ipcClasses;
    private List<String> cpcClasses;
    private Integer backwardCitationCount;
    private Integer forwardCitationCount;
    private String patentType;
    private List<String> inventors;
    private Integer nodeSize;
    private String nodeColor;
    private Integer depth;
}