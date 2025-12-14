package com.teamb.globalipbackend1.auth.repository;

import java.util.List;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import com.teamb.globalipbackend1.auth.entity.RoleRequest;
import com.teamb.globalipbackend1.auth.entity.RoleRequestStatus;

public interface RoleRequestRepository extends JpaRepository<@NonNull RoleRequest, @NonNull String> {

    boolean existsByUserIdAndStatus(String userId, RoleRequestStatus status);

    List<RoleRequest> findByStatus(RoleRequestStatus status);
}
