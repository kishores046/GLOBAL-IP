package com.teamb.globalipbackend1.tracking;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class MockLifecycleProvider {

    public ApplicationLifecycleDto createExpiringLifecycle(String patentId) {

        LocalDateTime now = LocalDateTime.now();

        return new ApplicationLifecycleDto(
                patentId,
                now.toLocalDate().minusYears(1),   // filing date
                now.toLocalDate().minusMonths(6),  // grant date
                now.toLocalDate(),                 // expiration TODAY
                "EXPIRING"
        );
    }

    public ApplicationLifecycleDto expiredLifecycle(String patentId) {

        return new ApplicationLifecycleDto(
                patentId,
                LocalDate.now().minusYears(1),
                LocalDate.now().minusMonths(6),
                LocalDate.now().minusDays(1),
                "EXPIRED"
        );
    }
}
