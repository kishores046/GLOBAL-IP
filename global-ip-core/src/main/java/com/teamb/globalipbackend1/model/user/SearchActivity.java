package com.teamb.globalipbackend1.model.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Getter
@Setter @ToString
@Table(
        name = "search_activity",
        indexes = {
                @Index(name = "idx_search_user", columnList = "user_id"),
                @Index(name = "idx_search_created", columnList = "created_at")
        }
)

public class SearchActivity {

    public SearchActivity(String searchMode, String userId) {
        this.searchMode = searchMode;
        this.userId = userId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "search_mode")
    private String searchMode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SearchActivity() {

    }

    @PrePersist
    public void update(){
        this.createdAt=LocalDateTime.now();
    }

}
