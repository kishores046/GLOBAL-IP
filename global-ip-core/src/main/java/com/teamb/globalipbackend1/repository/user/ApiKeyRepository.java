package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    List<ApiKey> findByUserId(String userId);

    Optional<ApiKey> findByIdAndUserId(Long id, String userId);

    List<ApiKey> findAll();
}
