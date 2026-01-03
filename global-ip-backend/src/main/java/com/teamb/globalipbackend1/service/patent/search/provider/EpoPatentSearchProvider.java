package com.teamb.globalipbackend1.service.patent.search.provider;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.patent.search.EPOPatentSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EpoPatentSearchProvider implements PatentSearchProvider {

    private final EPOPatentSearchService epoService;

    @Override
    public String getSource() {
        return "EPO";
    }

    @Override
    public boolean supportsJurisdiction(String jurisdiction) {
        return jurisdiction == null
                || !jurisdiction.equalsIgnoreCase("US");
    }

    @Override
    public List<PatentDocument> searchByKeyword(PatentSearchFilter filter) {
        return epoService.searchPatents(filter.getKeyword());
    }

    @Override
    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {
        return epoService.searchAdvanced(filter);
    }
}
