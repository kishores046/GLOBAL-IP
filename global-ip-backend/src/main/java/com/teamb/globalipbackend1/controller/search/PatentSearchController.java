package com.teamb.globalipbackend1.controller.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.service.search.PatentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
public class PatentSearchController {

    private final PatentSearchService patentSearchService;
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public List<PatentDocument> search(@RequestParam("title") String title) {
        return patentSearchService.searchPatents(title);
    }

    @PostMapping("/search/advanced")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public List<PatentDocument> advancedSearch(
            @RequestBody PatentSearchFilter filter) {

        return patentSearchService.searchWithFilters(filter);
    }

}