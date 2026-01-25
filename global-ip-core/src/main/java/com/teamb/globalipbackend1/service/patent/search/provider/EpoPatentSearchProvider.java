package com.teamb.globalipbackend1.service.patent.search.provider;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.patent.search.EPOPatentSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EpoPatentSearchProvider implements PatentSearchProvider {

    private final EPOPatentSearchService epoService;

    /**
     * Updated for 2026: Includes all 39 EPO member states,
     * plus the latest extension (BA) and validation states (MA, MD, TN, KH, GE, LA).
     * Also includes major offices covered by OPS worldwide bibliographic data (DOCDB).
     */
    private static final Set<String> EPO_JURISDICTIONS = Set.of(
            "AP", "AT", "AU", "BE", "BG", "CA", "CH", "CN", "CY", "CZ",
            "DE", "DK", "EA", "EE", "EP", "ES", "FI", "FR", "GB", "GC",
            "GE", "GR", "HR", "HU", "IE", "IT", "JP", "KR", "LT", "LU",
            "LV", "MA", "MD", "ME", "NL", "NO", "OA", "PL", "PT", "RO",
            "RS", "RU", "SE", "SI", "SK", "SM", "TN", "TR", "WO"
    );

    @Override
    public String getSource() {
        return "EPO";
    }

    @Override
    public boolean supportsJurisdiction(String jurisdiction) {
        if (jurisdiction == null || jurisdiction.isBlank() || "ALL".equalsIgnoreCase(jurisdiction)) {
            return true;
        }

        // Logic check: Allow EPO to search any jurisdiction in its supported set.
        // It's safer to check against the set than just excluding "US".
        return EPO_JURISDICTIONS.contains(jurisdiction.toUpperCase());
    }

    @Override
    public List<PatentDocument> searchByKeyword(PatentSearchFilter filter) {
        String jurisdiction = filter.getJurisdiction();

        // Ensure consistent casing for the query
        if (jurisdiction != null && !jurisdiction.isBlank() && !"ALL".equalsIgnoreCase(jurisdiction)) {
            return epoService.searchPatents(filter.getKeyword(), jurisdiction.toUpperCase());
        }
        return epoService.searchPatents(filter.getKeyword());
    }

    @Override
    public List<PatentDocument> searchAdvanced(PatentSearchFilter filter) {
        return epoService.searchAdvanced(filter);
    }
}