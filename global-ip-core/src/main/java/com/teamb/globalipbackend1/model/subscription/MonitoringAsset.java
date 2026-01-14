package com.teamb.globalipbackend1.model.subscription;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MonitoringAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String ipAddress;
}