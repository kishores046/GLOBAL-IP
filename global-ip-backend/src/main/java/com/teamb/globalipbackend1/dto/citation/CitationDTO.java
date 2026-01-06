package com.teamb.globalipbackend1.dto.citation;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CitationDTO {
    private String citingPatent;
    private String citedPatent;
    private String citationType;
    private String citationDirection;
    private String citationCategory;
    private String country;
    private LocalDate citedPatentDate;
}