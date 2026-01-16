package com.teamb.globalipbackend1.admin.dto;

import java.util.Set;

public record ChangeUserRoleRequest(
        Set<String> roles
) {}
