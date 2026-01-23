package com.teamb.globalipbackend1.admin.service;

import com.teamb.globalipbackend1.admin.audit.ApiUsageLog;
import com.teamb.globalipbackend1.admin.dto.*;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.exception.ResourceNotFoundException;
import com.teamb.globalipbackend1.exception.UserAlreadyExistsException;
import com.teamb.globalipbackend1.model.user.Role;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.RoleRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ApiUsageLogRepository apiUsageLogRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all users with pagination
     */
    public Page<@NonNull UserAdminDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return userRepository.findAll(pageable).map(this::toAdminDto);
    }

    /**
     * Search users by query (username or email) and/or role
     */
    public Page<@NonNull UserAdminDto> searchUsers(String query, String role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Specification<@NonNull User> spec = (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by username or email
            if (query != null && !query.isBlank()) {
                String searchPattern = "%" + query.toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern)
                ));
            }

            // Filter by role
            if (role != null && !role.isBlank()) {
                predicates.add(criteriaBuilder.isMember(
                        roleRepository.findByRoleType(role).orElse(null),
                        root.get("roles")
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::toAdminDto);
    }

    /**
     * Get single user by ID
     */
    public UserAdminDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return toAdminDto(user);
    }

    /**
     * Change user roles (accepts String role names)
     */
    @Transactional
    public UserAdminDto changeUserRoles(String userId, Set<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Convert String role names to Role entities
        Set<Role> roles = roleNames.stream()
                .map(roleName -> {
                    try {
                        Role roleType = new Role(roleName);
                        return roleRepository.findByRoleType(roleType.getRoleType())
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid role: " + roleName);
                    }
                })
                .collect(Collectors.toSet());

        user.setRoles(roles);
        return toAdminDto(userRepository.save(user));
    }

    /**
     * Delete user by ID
     */
    @Transactional
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }
        userRepository.deleteById(userId);
    }

    /**
     * Get user activity statistics
     */
    public UserActivityDto getUserActivity(String userId) {
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime last24h = now.minusDays(1);
        LocalDateTime last7d = now.minusDays(7);
        LocalDateTime last30d = now.minusDays(30);

        // Get activity counts
        long requestsLast24h = apiUsageLogRepository.countByUserIdAndTimestampAfter(userId, last24h);
        long requestsLast7d = apiUsageLogRepository.countByUserIdAndTimestampAfter(userId, last7d);
        long requestsLast30d = apiUsageLogRepository.countByUserIdAndTimestampAfter(userId, last30d);

        // Get last activity timestamp
        LocalDateTime lastActivity = apiUsageLogRepository.findTopByUserIdOrderByTimestampDesc(userId)
                .map(ApiUsageLog::getTimestamp)
                .orElse(null);

        // Get most used service
        String topService = apiUsageLogRepository.findTopServiceByUserId(userId);

        return new UserActivityDto(
                user.getUsername(),
                user.getEmail(),
                requestsLast24h,
                requestsLast7d,
                requestsLast30d,
                lastActivity,
                topService != null ? topService : "N/A"
        );
    }

    /**
     * Get inactive users (no activity in last 24 hours)
     */
    public List<UserProfileResponse> getInactiveUsersLast24h() {
        LocalDateTime since = LocalDateTime.now(ZoneOffset.UTC).minusDays(1);
        return userRepository.findInactiveUsersSince(since)
                .stream()
                .map(this::toProfileDto)
                .toList();
    }

    /**
     * Get dashboard counts summary
     */
    public DashboardUserCountResponse dashboardCounts() {
        long total = userRepository.count();
        long active = apiUsageLogRepository.activeUsers(
                LocalDateTime.now(ZoneOffset.UTC).minusDays(1));

        return new DashboardUserCountResponse(
                total,
                active,
                total - active
        );
    }

    // ========== PRIVATE HELPER METHODS ==========

    private UserAdminDto toAdminDto(User u) {
        return new UserAdminDto(
                u.getUserId(),
                u.getUsername(),
                u.getEmail(),
                u.getRoles() == null ? Set.of()
                        : u.getRoles().stream()
                        .map(Role::getRoleType)
                        .collect(Collectors.toSet()),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }

    private UserProfileResponse toProfileDto(User u) {
        return new UserProfileResponse(
                u.getUsername(),
                u.getEmail(),
                u.getRoles() == null ? Set.of()
                        : u.getRoles().stream()
                        .map(Role::getRoleType)
                        .collect(Collectors.toSet()),
                u.getPhoneNumber(),
                u.getCompany(),
                u.getLocation(),
                u.getPosition(),
                u.getBio()
        );
    }

    @Transactional
    public UserAdminDto createUser(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("User already exists by this email id");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.temporaryPassword()));
        user.setPhoneNumber(request.phoneNumber());
        user.setCompany(request.company());
        user.setLocation(request.location());
        user.setPosition(request.position());
        user.setPasswordChangeRequired(true);

        Set<Role> roles = request.roles().stream()
                .map(this::getOrCreateRole)
                .collect(Collectors.toSet());

        user.setRoles(roles);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return toAdminDto(userRepository.save(user));
    }

    private Role getOrCreateRole(String roleName) {
        return roleRepository.findByRoleType(roleName)
                .orElseGet(() -> {
                    Role role = new Role(roleName);
                    return roleRepository.save(role);
                });
    }


    @Transactional
    public BlockUserResponse blockUser(String userId, BlockUserRequest request, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.isBlocked()) {
            throw new IllegalStateException("User is already blocked");
        }

        user.setBlocked(true);
        user.setBlockReason(request.reason());
        user.setBlockedAt(LocalDateTime.now());
        user.setBlockedBy(adminEmail);

        userRepository.save(user);

        log.info("User {} blocked by admin {}. Reason: {}", user.getEmail(), adminEmail, request.reason());

        return new BlockUserResponse(
                user.getUserId(),
                user.getEmail(),
                true,
                user.getBlockReason(),
                user.getBlockedAt().toString(),
                "User blocked successfully"
        );
    }

    /**
     * Unblock a user
     */
    @Transactional
    public BlockUserResponse unblockUser(String userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.isBlocked()) {
            throw new IllegalStateException("User is not blocked");
        }

        user.setBlocked(false);
        user.setBlockReason(null);
        user.setBlockedAt(null);
        user.setBlockedBy(null);

        userRepository.save(user);

        log.info("User {} unblocked by admin {}", user.getEmail(), adminEmail);

        return new BlockUserResponse(
                user.getUserId(),
                user.getEmail(),
                false,
                null,
                null,
                "User unblocked successfully"
        );
    }


}