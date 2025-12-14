package com.teamb.globalipbackend1.auth.service;


import java.util.List;
import java.util.Set;
import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamb.globalipbackend1.auth.entity.RoleRequest;
import com.teamb.globalipbackend1.auth.entity.RoleRequestStatus;
import com.teamb.globalipbackend1.auth.repository.RoleRequestRepository;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.UserRepository;

@Service
public class RoleRequestService {

    private final RoleRequestRepository roleRequestRepo;
    private final UserRepository userRepo;
    private final RoleRepository roleRepository;

    public RoleRequestService(RoleRequestRepository roleRequestRepo,
                              UserRepository userRepo, RoleRepository roleRepository) {
        this.roleRequestRepo = roleRequestRepo;
        this.userRepo = userRepo;
        this.roleRepository = roleRepository;
    }

    // USER → Request admin role
    public void requestAdminRole(String userId) {
        boolean alreadyPending =
                roleRequestRepo.existsByUserIdAndStatus(userId, RoleRequestStatus.PENDING);

        if (alreadyPending) {
            throw new IllegalStateException("Admin request already pending");
        }

        RoleRequest request = new RoleRequest(userId, "ROLE_ADMIN");
        roleRequestRepo.save(request);
    }

    // ADMIN → View pending requests
    public List<RoleRequest> getPendingRequests() {
        return roleRequestRepo.findByStatus(RoleRequestStatus.PENDING);
    }

    // ADMIN → Approve
    @Transactional
    public void approveRequest(String requestId, String adminId) {
        RoleRequest request = roleRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role adminRole = roleRepository.findByRoleType("ADMIN")
                .orElseGet(() -> {
                    Role newRole = new Role("ADMIN");
                    return roleRepository.save(newRole);
                });
        Set<Role> roles=user.getRoles();
        roles.add(adminRole);
        user.setRoles(roles);
        request.approve(adminId);
    }

    // ADMIN → Reject
    public void rejectRequest(String requestId, String adminId) {
        RoleRequest request = roleRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.reject(adminId);
        roleRequestRepo.save(request);
    }

    // ADMIN → Waitlist
    public void waitlistRequest(String requestId, String adminId) {
        RoleRequest request = roleRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.waitlist(adminId);
        roleRequestRepo.save(request);
    }
}

