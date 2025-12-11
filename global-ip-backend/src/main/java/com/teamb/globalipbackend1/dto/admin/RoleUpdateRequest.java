package com.teamb.globalipbackend1.dto.admin;

import com.teamb.globalipbackend1.model.Role;

import java.util.Set;

public record RoleUpdateRequest(Set<Role> role) {
}
