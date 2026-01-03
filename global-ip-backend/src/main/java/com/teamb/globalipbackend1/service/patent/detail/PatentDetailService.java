package com.teamb.globalipbackend1.service.patent.detail;


import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;

import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.repository.bookmark.BookmarkedPatentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentDetailService {

    private final CacheManager cacheManager;
    private final BookmarkedPatentRepository bookmarkRepo;

    public GlobalPatentDetailDto getPatentDetail(
            String publicationNumber,
            String userId
    ) {
        var cache = cacheManager.getCache(CacheNames.PATENT_SNAPSHOT);
        if (cache == null) {
            throw new RuntimeException("Patent snapshot logPatents not available");
        }

        PatentDocument doc =
                cache.get(publicationNumber, PatentDocument.class);

        if (doc == null) {
            throw new RuntimeException(
                    "Patent not found (not present in search results): " + publicationNumber
            );
        }

        GlobalPatentDetailDto dto = mapToDetail(doc);

        dto.setBookmarked(
                bookmarkRepo.existsByUserIdAndPublicationNumber(
                        userId, publicationNumber
                )
        );

        return dto;
    }

    private GlobalPatentDetailDto mapToDetail(PatentDocument p) {

        GlobalPatentDetailDto dto = new GlobalPatentDetailDto();

        dto.setPublicationNumber(p.getPublicationNumber());
        dto.setJurisdiction(p.getJurisdiction());
        dto.setSource(p.getSource());

        dto.setTitle(p.getTitle());
        dto.setAbstractText(p.getAbstractText());

        dto.setFilingDate(p.getFilingDate());
        dto.setGrantDate(p.getGrantDate());
        dto.setWipoKind(p.getWipoKind());

        dto.setInventors(p.getInventors());
        dto.setAssignees(p.getAssignees());

        dto.setCpcClasses(p.getCpcClasses());
        dto.setIpcClasses(p.getIpcClasses());

        dto.setTimesCited(p.getTimesCited());
        dto.setTotalCitations(p.getTotalCitations());

        return dto;
    }

}