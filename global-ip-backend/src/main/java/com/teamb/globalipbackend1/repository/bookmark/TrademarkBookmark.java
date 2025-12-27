package com.teamb.globalipbackend1.repository.bookmark;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "trademark_bookmarks",
        uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "trademarkId"})
)
@Getter
@Setter
public class TrademarkBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String trademarkId;

    private String source; // TMVIEW, USPTO, MOCK

    private LocalDate bookmarkedAt = LocalDate.now();
}
