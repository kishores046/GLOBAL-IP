package com.teamb.globalipbackend1.repository.user;

import java.util.List;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import com.teamb.globalipbackend1.model.authentication.RoleRequest;
import com.teamb.globalipbackend1.model.authentication.RoleRequestStatus;

public interface RoleRequestRepository extends JpaRepository<@NonNull RoleRequest, @NonNull String> {

    boolean existsByUserIdAndStatus(String userId, RoleRequestStatus status);

    List<RoleRequest> findByStatus(RoleRequestStatus status);
}
