package com.teamb.globalipbackend1.model.patents;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "patent_citations",
        indexes = {
                @Index(name = "idx_citing_patent", columnList = "citing_patent_number"),
                @Index(name = "idx_cited_patent", columnList = "cited_patent_number")
        }
)
@Data
public class PatentCitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The patent that cites (the newer patent)
     */
    @Column(name = "citing_patent_number", nullable = false)
    private String citingPatentNumber;

    /**
     * The patent being cited (the older patent, prior art)
     */
    @Column(name = "cited_patent_number", nullable = false)
    private String citedPatentNumber;

    /**
     * Title of the cited patent (for quick display)
     */
    @Column(name = "cited_patent_title", length = 1000)
    private String citedPatentTitle;

    /**
     * Date of cited patent
     */
    @Column(name = "cited_patent_date")
    private LocalDate citedPatentDate;

    /**
     * Citation sequence (order in reference list)
     */
    @Column(name = "citation_sequence")
    private Integer citationSequence;

    /**
     * Category: "cited by applicant", "cited by examiner", etc.
     */
    @Column(name = "citation_category")
    private String citationCategory;

    /**
     * Direction: BACKWARD or FORWARD
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "citation_direction")
    private CitationDirection citationDirection;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();


    @Enumerated(EnumType.STRING)
    @Column(name = "citation_type", nullable = false)
    private CitationType citationType;

    @Column(name = "citation_country")
    private String citationCountry;

}

