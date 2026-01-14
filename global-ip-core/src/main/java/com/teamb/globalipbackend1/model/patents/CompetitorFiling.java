package com.teamb.globalipbackend1.model.patents;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "competitor_filings",
        indexes = {
                @Index(name = "idx_competitor_id", columnList = "competitorId"),
                @Index(name = "idx_patent_id", columnList = "patentId", unique = true),
                @Index(name = "idx_pub_date", columnList = "publicationDate"),
                @Index(name = "idx_competitor_pub_date", columnList = "competitorId,publicationDate")
        }
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitorFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long competitorId;          // Reference to Competitor entity

    @Column(nullable = false, unique = true, length = 50)
    private String patentId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false)
    private LocalDate publicationDate;

    @Column(length = 10)
    private String jurisdiction;         // US, EP, WO, etc.

    @Column(length = 200)
    private String assignee;             // Actual assignee from patent data

    @Column(nullable = false)
    private LocalDateTime fetchedAt;

    @Column(length = 100)
    private String filingType;           // PATENT, APPLICATION, etc.

    @Column(length = 20)
    private String status;               // ACTIVE, EXPIRED, PENDING
}
