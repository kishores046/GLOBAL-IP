package com.teamb.globalipbackend1.external.patentsview.dto;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class PatentDetailDto {

    private String patentId;
    private String title;
    private String abstractText;
    private LocalDate grantDate;
    private String wipoKind;

    private List<String> assignees;
    private List<String> inventors;
    private LocalDate fillingDate;
    private List<PatentsViewCpcCurrent> cpcClasses;

    private Integer timesCited;
    private ApplicationLifecycleDto lifecycle;

    private Integer totalCitations;
}
