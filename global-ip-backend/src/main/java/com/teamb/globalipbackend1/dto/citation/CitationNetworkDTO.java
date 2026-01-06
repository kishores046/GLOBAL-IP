package com.teamb.globalipbackend1.dto.citation;

import com.teamb.globalipbackend1.dto.citation.CitationDTO;
import lombok.Data;

import java.util.List;

@Data
public class CitationNetworkDTO {

    /** Center patent of the network */
    private String centerPatentId;

    /** Patents cited by this patent */
    private List<CitationDTO> backwardCitations;

    /** Patents that cite this patent */
    private List<CitationDTO> forwardCitations;

    /** Total backward citations (may exceed list size due to UI limits) */
    private int backwardCount;

    /** Total forward citations (may exceed list size due to UI limits) */
    private int forwardCount;

    /** Derived total citations */
    public int getTotalCitations() {
        return backwardCount + forwardCount;
    }
}
