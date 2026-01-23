package com.teamb.globalipbackend1.model.lifecycle;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@IdClass(UserTrademarkLifecycleId.class)
@Table(name = "user_trademark_lifecycle")
@Getter
@Setter
public class UserTrademarkLifecycle {

    @Id
    private String userId;

    @Id
    private String trademarkId;

    private String status;
    private String rawStatusCode;
    private LocalDate filingDate;
    private LocalDate lastUpdated;
}
