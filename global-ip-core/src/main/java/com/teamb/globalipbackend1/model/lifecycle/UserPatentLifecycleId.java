package com.teamb.globalipbackend1.model.lifecycle;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@AllArgsConstructor
public class UserPatentLifecycleId implements Serializable {

    private String userId;
    private String patentId;
}
