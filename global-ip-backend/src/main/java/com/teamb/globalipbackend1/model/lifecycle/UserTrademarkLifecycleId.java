package com.teamb.globalipbackend1.model.lifecycle;



import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserTrademarkLifecycleId implements Serializable {

    private String userId;
    private String trademarkId;
}
