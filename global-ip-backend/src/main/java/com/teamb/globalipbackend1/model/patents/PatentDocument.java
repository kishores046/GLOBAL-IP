package com.teamb.globalipbackend1.model.patents;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class PatentDocument {

    /** Publication number (US10000001B2, EP1234567A1, etc.) */
    private String publicationNumber;
    private String source;
    /** Jurisdiction / country code */
    private String jurisdiction;

    /** Patent title */
    private String title;

    /** Abstract text */
    private String abstractText;

    /* ---------------- Dates ---------------- */

    /** Filing date (earliest application date for US) */
    private LocalDate filingDate;

    /** Grant / publication date */
    private LocalDate grantDate;

    /* ---------------- Parties ---------------- */

    private List<String> inventors;
    private List<String> assignees;

    /* ---------------- Classification ---------------- */

    private List<String> ipcClasses;
    private List<String> cpcClasses;

    /* ---------------- Analytics ---------------- */

    /** WIPO kind code (A1, B2, etc.) */
    private String wipoKind;

    /** Number of times cited by later US patents */
    private Integer timesCited;

    /** Total documents cited by this patent */
    private Integer totalCitations;
}
