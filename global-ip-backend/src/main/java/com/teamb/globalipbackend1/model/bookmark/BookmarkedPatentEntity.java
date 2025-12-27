package com.teamb.globalipbackend1.model.bookmark;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookmarked_patents",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "publication_number"}
        )
)
@Getter
@Setter
public class BookmarkedPatentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "publication_number", nullable = false)
    private String publicationNumber;

    @Column(name = "source", nullable = false)
    private String source; // EPO / PATENTSVIEW

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}