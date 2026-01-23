package com.teamb.globalipbackend1.model.trend;


import jakarta.persistence.Entity;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_report")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reportName;

    @Column(nullable = false)
    private Integer reportYear;

    @Column(columnDefinition = "TEXT")
    private String reportData;

    private LocalDateTime generatedAt;
    private String generatedBy;
}