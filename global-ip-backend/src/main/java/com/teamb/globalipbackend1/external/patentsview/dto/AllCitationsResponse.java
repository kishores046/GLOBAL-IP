package com.teamb.globalipbackend1.external.patentsview.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AllCitationsResponse {
    private List<PatentsViewUSPatentCitation> backwardUSPatentCitations;
    private List<PatentsViewUSPatentCitation> forwardUSPatentCitations;
    private List<PatentsViewUSApplicationCitation> usApplicationCitations;
    private List<PatentsViewForeignCitation> foreignCitations;

    public int getTotalBackwardCount() {
        return (backwardUSPatentCitations != null ? backwardUSPatentCitations.size() : 0)
                + (usApplicationCitations != null ? usApplicationCitations.size() : 0)
                + (foreignCitations != null ? foreignCitations.size() : 0);
    }

    public int getTotalForwardCount() {
        return forwardUSPatentCitations != null ? forwardUSPatentCitations.size() : 0;
    }
}