package com.teamb.globalipbackend1.model.subscription;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @Enumerated(EnumType.STRING)
    private PlanType planType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String status; // ACTIVE / EXPIRED
}