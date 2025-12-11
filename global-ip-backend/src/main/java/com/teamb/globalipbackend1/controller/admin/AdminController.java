package com.teamb.globalipbackend1.controller.admin;

import com.teamb.globalipbackend1.dto.ApiResponse;
import com.teamb.globalipbackend1.dto.admin.RoleUpdateRequest;
import com.teamb.globalipbackend1.dto.authentication.UserDto;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.service.admin.AdminService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor

public class AdminController {
    private final AdminService adminService;
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok("Admin Dashboard Data");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> listUsers() {
        return adminService.listUsers();
    }


    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<@NonNull UserDto> changeUserRole(@PathVariable("id") String id,
                                                           @RequestBody RoleUpdateRequest req) {
        UserDto updated = adminService.changeUserRoles(id, req.role());
        return ResponseEntity.ok(updated);
    }
}
