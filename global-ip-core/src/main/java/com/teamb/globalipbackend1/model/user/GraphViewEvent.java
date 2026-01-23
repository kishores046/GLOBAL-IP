package com.teamb.globalipbackend1.model.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Data
public class GraphViewEvent {

    @Id
    @GeneratedValue
    private Long id;

    private String userId;
    private String graphKey;
    private LocalDateTime viewedAt;
}
