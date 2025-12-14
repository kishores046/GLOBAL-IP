package com.teamb.globalipbackend1.controller.admin;


import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.service.admin.AdminService;
import lombok.AllArgsConstructor;
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

}
