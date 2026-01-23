package com.teamb.globalipbackend1.admin.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_usage_log")
@Getter @Setter
public class ApiUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String service;
    private String action;
    private String status;
    private long responseTimeMs;

    private LocalDateTime timestamp;
}

