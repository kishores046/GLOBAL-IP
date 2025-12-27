package com.teamb.globalipbackend1.repository.user;

import com.teamb.globalipbackend1.model.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByRoleType(String roleType);
}
