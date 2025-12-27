package com.teamb.globalipbackend1.dto.search;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter @Setter @ToString
public class PatentSearchFilter {

    private String keyword;

    private String jurisdiction;
    private LocalDate filingDateFrom;
    private LocalDate filingDateTo;

    private String assignee;
    private String inventor;
}
