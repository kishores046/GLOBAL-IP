package com.teamb.globalipbackend1.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ApiUsageLogDto {
    private Long id;
    private LocalDateTime timestamp;
    private String service;
    private String action;
    private String status;
    private Long responseTimeMs;
    private String userId;
}