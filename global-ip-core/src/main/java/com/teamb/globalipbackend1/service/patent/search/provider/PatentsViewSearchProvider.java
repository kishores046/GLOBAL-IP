package com.teamb.globalipbackend1.service.patent.search.provider;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.patent.search.PatentsViewSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentsViewSearchProvider implements PatentSearchProvider {

    private final PatentsViewSearchService service;

    @Override
    public String getSource() {
        return "PATENTSVIEW";
    }

    @Override
    public boolean supportsJurisdiction(String jurisdiction) {

        if (jurisdiction == null || jurisdiction.isBlank() || "ALL".equalsIgnoreCase(jurisdiction)) {
            return true;  // Participate in "ALL" searches
        }
        
        return "US".equalsIgnoreCase(jurisdiction);
    }

    @Override
    public List<PatentDocument> searchByKeyword(PatentSearchFilter filter) {
        return service.searchPatentsByKeyword(filter.getKeyword(), filter);
    }

    @Override
    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {
        return service.advancedSearch(filter);
    }
}