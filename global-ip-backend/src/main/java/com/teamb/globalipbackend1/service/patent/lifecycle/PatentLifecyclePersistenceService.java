package com.teamb.globalipbackend1.service.patent.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.model.lifecycle.UserPatentLifecycle;
import com.teamb.globalipbackend1.model.lifecycle.UserPatentLifecycleId;
import com.teamb.globalipbackend1.repository.user.UserPatentLifecycleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatentLifecyclePersistenceService {

    private final UserPatentLifecycleRepository repository;

   

    public void saveLifecycle(String userId, ApplicationLifecycleDto lifecycle) {

        UserPatentLifecycle entity =
                UserPatentLifecycle.builder()
                        .id(new UserPatentLifecycleId(
                                userId,
                                lifecycle.publicationNumber()
                        ))
                        .filingDate(lifecycle.filingDate())
                        .grantDate(lifecycle.grantDate())
                        .expirationDate(lifecycle.expirationDate())
                        .status(lifecycle.status())
                        .lastComputedAt(LocalDateTime.now())
                        .build();

        repository.save(entity);
    }

    /* ===================== LISTING ===================== */

    /**
     * Get all tracked patents for a user
     */
    public List<ApplicationLifecycleDto> getTrackedPatents(String userId) {

        log.info("[LIFECYCLE] Fetching tracked patents for user={}", userId);

        return repository.findByIdUserId(userId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Optional: get a specific tracked patent
     */
    public ApplicationLifecycleDto getTrackedPatent(
            String userId,
            String publicationNumber
    ) {
        return repository.findById(
                        new UserPatentLifecycleId(userId, publicationNumber)
                )
                .map(this::toDto)
                .orElse(null);
    }



    private ApplicationLifecycleDto toDto(UserPatentLifecycle entity) {
        return new ApplicationLifecycleDto(
                entity.getId().getPatentId(),
                entity.getFilingDate(),
                entity.getGrantDate(),
                entity.getExpirationDate(),
                entity.getStatus()
        );
    }
}
