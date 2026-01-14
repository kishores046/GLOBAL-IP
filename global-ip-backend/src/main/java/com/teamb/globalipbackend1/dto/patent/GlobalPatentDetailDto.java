package com.teamb.globalipbackend1.dto.patent;


import com.teamb.globalipbackend1.dto.citation.CitationNetworkDTO;
import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class GlobalPatentDetailDto {



    /** Publication number (e.g. US10000001B2, EP1234567A1) */
    private String publicationNumber;

    /** Data source: PatentsView | EPO */
    private String source;

    /** Jurisdiction / country code (US, EP, WO, etc.) */
    private String jurisdiction;


    private String title;
    private String abstractText;
    private String wipoKind;


    /**
     * Filing date:
     * - US: earliest application (priority-aware)
     * - EPO: application filing date
     */
    private LocalDate filingDate;

    /**
     * Grant date:
     * - US: patent grant date
     * - EPO: publication/grant date
     */
    private LocalDate grantDate;

    private LocalDate expiryDate;

    /* ---------------- Parties ---------------- */

    private List<String> inventors;
    private List<String> assignees;


    private List<String> cpcClasses;
    private List<String> ipcClasses;



    /** Number of times cited by later US patents */
    private Integer timesCited;

    /** Total documents cited by this patent */
    private Integer totalCitations;


    /** Whether the current user bookmarked this patent */
    private boolean bookmarked;


    private CitationNetworkDTO citationNetwork;


    private ApplicationLifecycleDto applicationLifecycleDto;


}
