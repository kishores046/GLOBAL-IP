package com.teamb.globalipbackend1.model.patents;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "competitors",
        indexes = {
                @Index(name = "idx_competitor_code", columnList = "code", unique = true),
                @Index(name = "idx_competitor_active", columnList = "active"),
                @Index(name = "idx_competitor_jurisdiction", columnList = "jurisdiction")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;                 // GOOGLE, SAMSUNG

    @Column(nullable = false, length = 200)
    private String displayName;          // Google Inc.

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "competitor_assignees",
            joinColumns = @JoinColumn(name = "competitor_id"),
            indexes = @Index(name = "idx_assignee_name", columnList = "assignee_name")
    )
    @Column(name = "assignee_name", length = 200)
    private List<String> assigneeNames = new ArrayList<>();

    @Column(nullable = false)
    private Boolean active = true;

    @Column(length = 500)
    private String description;

    @Column(length = 100)
    private String industry;

    /**
     * US, EP, BOTH
     */
    @Column(nullable = false, length = 10)
    private String jurisdiction;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
