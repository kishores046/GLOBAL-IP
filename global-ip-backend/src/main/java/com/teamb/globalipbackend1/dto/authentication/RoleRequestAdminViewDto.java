package com.teamb.globalipbackend1.dto.authentication;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter @Setter
@AllArgsConstructor
public class RoleRequestAdminViewDto {

    private String  requestId;
    private String userId;
    private String username;
    private String email;
    private String requestedRole;
    private LocalDateTime requestedAt;


}
