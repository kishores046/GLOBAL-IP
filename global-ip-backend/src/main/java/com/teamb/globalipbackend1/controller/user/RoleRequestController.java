package com.teamb.globalipbackend1.controller.user;

import java.util.List;
import java.util.Objects;

import com.teamb.globalipbackend1.dto.APIResponse;
import com.teamb.globalipbackend1.dto.authentication.RoleRequestAdminViewDto;
import com.teamb.globalipbackend1.security.MyUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import com.teamb.globalipbackend1.service.auth.RoleRequestService;

@RestController
@RequestMapping("/api/role-requests")
@Tag(name = "Role Requests", description = "Role upgrade and admin approval APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class RoleRequestController {

    private final RoleRequestService roleRequestService;

    public RoleRequestController(RoleRequestService roleRequestService) {
        this.roleRequestService = roleRequestService;
    }


    @Operation(
            summary = "Request admin role",
            description = "Allows a user to request admin role approval.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Request submitted"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )

    @PostMapping("/admin")
    @PreAuthorize("hasRole('USER')")
    public APIResponse requestAdmin(Authentication auth) {
        String userId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.requestAdminRole(userId);
        return new APIResponse("Admin role request submitted");
    }

    @Operation(
            summary = "View pending role requests",
            description = "Returns pending role requests for admin review.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pending requests list")
            }
    )

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleRequestAdminViewDto> pendingRequests() {
        return roleRequestService.getPendingRequests();
    }


    @Operation(
            summary = "Approve admin role request",
            description = "Approves a pending admin role request. Admin-only operation.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Admin request approved"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )
    @PostMapping("/adminOnly/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse approve(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.approveRequest(id, adminId);
        return new APIResponse("Admin request approved");
    }


    @Operation(
            summary = "Reject admin role request",
            description = "Rejects a pending admin role request. Admin-only operation.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Admin request rejected"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )
    @PostMapping("/adminOnly/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse reject(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.rejectRequest(id, adminId);
        return new APIResponse("Admin request rejected");
    }

    @Operation(
            summary = "Waitlist admin role request",
            description = "Moves a pending admin role request to waitlist. Admin-only operation.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Admin request waitlisted"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )

    @PostMapping("/adminOnly/{id}/waitlist")
    @PreAuthorize("hasRole('ADMIN')")
    public APIResponse waitlist(@PathVariable String id, Authentication auth) {
        String adminId = ((MyUserDetails) Objects.requireNonNull(auth.getPrincipal())).getUser().getUserId();
        roleRequestService.waitlistRequest(id, adminId);
        return new APIResponse("Admin request waitlisted");
    }
}
