package com.teamb.globalipbackend1.controller.admin;


import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "Admin", description = "Admin-only system management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminController {
    private final AdminService adminService;

    @Operation(
            summary = "Get admin dashboard",
            description = "Returns dashboard data for admin users.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Dashboard data retrieved"),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok("Admin Dashboard Data");
    }

    @Operation(
            summary = "List all users",
            description = "Returns a list of all registered users (admin only).",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Users list",
                            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))
                    ),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> listUsers() {
        return adminService.listUsers();
    }


    @Operation(
            summary = "Delete user",
            description = "Deletes a user by ID (admin only).",
            responses = {
                    @ApiResponse(responseCode = "204", description = "User deleted"),
                    @ApiResponse(responseCode = "403", description = "Access denied")
            }
    )
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204
    }

}
