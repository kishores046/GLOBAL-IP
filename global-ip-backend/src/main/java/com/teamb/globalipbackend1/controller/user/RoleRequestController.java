package com.teamb.globalipbackend1.controller.user;

import java.util.List;
import java.util.Objects;

import com.teamb.globalipbackend1.dto.authentication.RoleRequestAdminViewDto;
import com.teamb.globalipbackend1.security.MyUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.teamb.globalipbackend1.service.auth.RoleRequestService;
import com.teamb.globalipbackend1.dto.ApiResponse;

@RestController
@RequestMapping("/api/role-requests")
public class RoleRequestController {

    private final RoleRequestService roleRequestService;

    public RoleRequestController(RoleRequestService roleRequestService) {
        this.roleRequestService = roleRequestService;
    }


    @PostMapping("/admin")
    @PreAuthorize("hasRole('USER')")
    public ApiResponse requestAdmin(Authentication auth) {
        String userId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.requestAdminRole(userId);
        return new ApiResponse("Admin role request submitted");
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleRequestAdminViewDto> pendingRequests() {
        return roleRequestService.getPendingRequests();
    }


    @PostMapping("/adminOnly/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse approve(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.approveRequest(id, adminId);
        return new ApiResponse("Admin request approved");
    }


    @PostMapping("/adminOnly/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse reject(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.rejectRequest(id, adminId);
        return new ApiResponse("Admin request rejected");
    }

    @PostMapping("/adminOnly/{id}/waitlist")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse waitlist(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.waitlistRequest(id, adminId);
        return new ApiResponse("Admin request waitlisted");
    }
}
