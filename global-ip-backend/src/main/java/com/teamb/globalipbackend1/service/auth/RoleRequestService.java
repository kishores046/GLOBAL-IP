package com.teamb.globalipbackend1.service.auth;


import java.util.List;
import java.util.Set;

import com.teamb.globalipbackend1.dto.authentication.RoleRequestAdminViewDto;
import com.teamb.globalipbackend1.model.user.Role;
import com.teamb.globalipbackend1.repository.user.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamb.globalipbackend1.model.authentication.RoleRequest;
import com.teamb.globalipbackend1.model.authentication.RoleRequestStatus;
import com.teamb.globalipbackend1.repository.user.RoleRequestRepository;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.UserRepository;

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

    public void requestAdminRole(String userId) {
        boolean alreadyPending =
                roleRequestRepo.existsByUserIdAndStatus(userId, RoleRequestStatus.PENDING);

        if (alreadyPending) {
            throw new IllegalStateException("Admin request already pending");
        }

        RoleRequest request = new RoleRequest(userId, "ROLE_ADMIN");
        roleRequestRepo.save(request);
    }


    public List<RoleRequestAdminViewDto> getPendingRequests() {

        List<RoleRequest> requests =
                roleRequestRepo.findByStatus(RoleRequestStatus.PENDING);

        return requests.stream()
                .map(req -> {
                    User user = userRepo.findById(req.getUserId())
                            .orElseThrow(() ->
                                    new RuntimeException("User not found for role request"));

                    return new RoleRequestAdminViewDto(
                            req.getId(),
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            req.getRequestedRole(),
                            req.getRequestedAt()
                    );
                })
                .toList();
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

