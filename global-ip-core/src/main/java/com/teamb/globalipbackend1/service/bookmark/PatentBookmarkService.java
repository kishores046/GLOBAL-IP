package com.teamb.globalipbackend1.service.bookmark;



import com.teamb.globalipbackend1.cache.CacheNames;
import com.teamb.globalipbackend1.dto.patent.BookmarkedPatentDto;
import com.teamb.globalipbackend1.model.bookmark.BookmarkedPatentEntity;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import com.teamb.globalipbackend1.repository.bookmark.BookmarkedPatentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatentBookmarkService {

    private final BookmarkedPatentRepository repository;

    private final CacheManager cacheManager;

    public List<BookmarkedPatentDto> getBookmarkedPatents(String userId) {

        Cache snapshotCache =
                cacheManager.getCache(CacheNames.PATENT_SNAPSHOT);

        return repository.findByUserId(userId).stream()
                .map(b -> {
                    PatentDocument doc =
                            snapshotCache != null
                                    ? snapshotCache.get(b.getPublicationNumber(), PatentDocument.class)
                                    : null;

                    BookmarkedPatentDto dto = new BookmarkedPatentDto();
                    dto.setPublicationNumber(b.getPublicationNumber());
                    dto.setSource(b.getSource());

                    if (doc != null) {
                        dto.setTitle(doc.getTitle());
                        dto.setJurisdiction(doc.getJurisdiction());
                        dto.setFilingDate(doc.getFilingDate());
                        dto.setGrantDate(doc.getGrantDate());
                    }

                    return dto;
                })
                .toList();
    }

    public void save(String userId, String publicationNumber, String source) {

        if (repository.existsByUserIdAndPublicationNumber(
                userId, publicationNumber)) {
            return;
        }

        BookmarkedPatentEntity entity = new BookmarkedPatentEntity();
        entity.setUserId(userId);
        entity.setPublicationNumber(publicationNumber);
        entity.setSource(source);

        repository.save(entity);
    }

    public void unsave(String userId, String publicationNumber) {
        repository.findByUserIdAndPublicationNumber(
                userId, publicationNumber
        ).ifPresent(repository::delete);
    }
}
