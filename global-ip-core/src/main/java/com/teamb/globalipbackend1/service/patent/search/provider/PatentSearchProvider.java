package com.teamb.globalipbackend1.service.patent.search.provider;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;

import java.util.List;

public interface PatentSearchProvider {

    String getSource();

    boolean supportsJurisdiction(String jurisdiction);

    List<PatentDocument> searchByKeyword(PatentSearchFilter filter);

    List<PatentDocument> searchAdvanced(PatentSearchFilter filter);
}