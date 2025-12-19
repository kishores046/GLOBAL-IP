package com.teamb.globalipbackend1.dto.search;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class PatentSearchFilter {

    private String keyword;

    private String jurisdiction;        // e.g. US, EP, JP
    private LocalDate filingDateFrom;
    private LocalDate filingDateTo;

    private String assignee;             // free text
    private String inventor;             // free text
}
