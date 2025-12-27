package com.teamb.globalipbackend1.repository.bookmark;

import com.teamb.globalipbackend1.model.bookmark.BookmarkedPatentEntity;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkedPatentRepository
        extends JpaRepository<@NonNull BookmarkedPatentEntity, @NonNull String> {

    boolean existsByUserIdAndPublicationNumber(
            String userId,
            String publicationNumber
    );

    Optional<BookmarkedPatentEntity> findByUserIdAndPublicationNumber(
            String userId,
            String publicationNumber
    );

    List<BookmarkedPatentEntity> findByUserId(String userId);
}
