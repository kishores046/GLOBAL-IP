package com.teamb.globalipbackend1.model.lifecycle;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_patent_lifecycle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPatentLifecycle {

    @EmbeddedId
    private UserPatentLifecycleId id;

    private LocalDate filingDate;
    private LocalDate grantDate;
    private LocalDate expirationDate;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime lastComputedAt;
}
