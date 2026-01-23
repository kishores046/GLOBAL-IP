package com.teamb.globalipbackend1.admin.controller;

import com.teamb.globalipbackend1.admin.dto.*;
import com.teamb.globalipbackend1.admin.service.AdminService;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * Get paginated list of all users
     */
    @GetMapping("/users")
    public Page<@NonNull UserAdminDto> users(
            @RequestParam(defaultValue = "0") int page,  // Fixed: was 5, should be 0
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getAllUsers(page, size);
    }

    /**
     * Search users by username, email, or role
     */
    @GetMapping("/users/search")
    public Page<@NonNull UserAdminDto> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.searchUsers(query, role, page, size);
    }

    /**
     * Get single user details
     */
    @GetMapping("/users/{id}")
    public UserAdminDto getUser(@PathVariable String id) {
        return adminService.getUserById(id);
    }

    /**
     * Update user roles
     */
    @PutMapping("/users/{id}/roles")
    public UserAdminDto updateUserRoles(
            @PathVariable String id,
            @RequestBody Set<String> roles
    ) {
        return adminService.changeUserRoles(id, roles);
    }

    /**
     * Delete a user
     */
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
    }

    /**
     * Get user activity/usage statistics
     */
    @GetMapping("/users/{id}/activity")
    public UserActivityDto getUserActivity(@PathVariable String id) {
        return adminService.getUserActivity(id);
    }

    /**
     * Get list of inactive users (no activity in last 24 hours)
     */
    @GetMapping("/users/inactive")
    public List<UserProfileResponse> getInactiveUsers() {
        return adminService.getInactiveUsersLast24h();
    }

    /**
     * Get dashboard summary counts
     */
    @GetMapping("/dashboard/counts")
    public DashboardUserCountResponse getDashboardCounts() {
        return adminService.dashboardCounts();
    }


    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserAdminDto createUser(@RequestBody CreateUserRequest request) {
        return adminService.createUser(request);
    }


    @PostMapping("/users/{id}/block")
    public BlockUserResponse blockUser(
            @PathVariable String id,
            @RequestBody @Valid BlockUserRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        return adminService.blockUser(id, request, adminEmail);
    }

    /**
     * Unblock a user
     */
    @PostMapping("/users/{id}/unblock")
    public BlockUserResponse unblockUser(
            @PathVariable String id,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        return adminService.unblockUser(id, adminEmail);
    }
}