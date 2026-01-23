package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.ApiKey;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<@NonNull ApiKey, @NonNull Long> {

    List<ApiKey> findByUserId(String userId);

    Optional<ApiKey> findByIdAndUserId(Long id, String userId);

    Page<@NonNull ApiKey> findAll(Pageable pageable);
}
