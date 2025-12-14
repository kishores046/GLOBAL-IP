package com.teamb.globalipbackend1.auth.entity;

import java.time.LocalDateTime;

import com.teamb.globalipbackend1.util.id.PrefixedId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "role_requests")
@Getter @Setter
public class RoleRequest {

    @Id
    @PrefixedId
    @Column(name = "role_request_id")
    private String id;

    @Column(nullable = false,name="user_id")
    private String userId;

    @Column(nullable = false,name = "requested_role")
    private String requestedRole; // e.g. ROLE_ADMIN

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,name="status")
    private RoleRequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private String reviewedBy; // admin userId

    private LocalDateTime reviewedAt;

    // constructors
    public RoleRequest() {}

    public RoleRequest(String userId, String requestedRole) {
        this.userId = userId;
        this.requestedRole = requestedRole;
        this.status = RoleRequestStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }
    public void approve(String adminId) {
        this.status = RoleRequestStatus.APPROVED;
        this.reviewedBy = adminId;
        this.reviewedAt = LocalDateTime.now();
    }

    public void reject(String adminId) {
        this.status = RoleRequestStatus.REJECTED;
        this.reviewedBy = adminId;
        this.reviewedAt = LocalDateTime.now();
    }

    public void waitlist(String adminId) {
        this.status = RoleRequestStatus.WAITLISTED;
        this.reviewedBy = adminId;
        this.reviewedAt = LocalDateTime.now();
    }
}
