package com.teamb.globalipbackend1.model.tracking;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTrackingPreferencesId implements Serializable {

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "patent_id", nullable = false)
    private String patentId;
}