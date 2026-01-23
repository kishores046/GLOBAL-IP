package com.teamb.globalipbackend1.external.epo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EpoCompetitorFilingDto {
    private String publicationNumber;
    private String title;
    private String applicant;
    private LocalDate publicationDate;
    private String kind;
}
