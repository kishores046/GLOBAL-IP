package com.teamb.globalipbackend1.repository;

import com.teamb.globalipbackend1.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByRoleType(String roleType);
}
