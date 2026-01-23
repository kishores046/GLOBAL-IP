package com.teamb.globalipbackend1.service.auth;

import com.teamb.globalipbackend1.dto.authentication.*;
import com.teamb.globalipbackend1.exception.DuplicateResourceException;
import com.teamb.globalipbackend1.model.user.Role;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.RoleRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import com.teamb.globalipbackend1.security.JwtUtil;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j

public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RoleRepository roleRepository;
    private final TokenBlacklistService tokenBlacklistService;
    private final SecurityUtil securityUtil;

    /**
     * Authenticate user
     */
    public LoginResponse authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.isBlocked()) {
            log.warn("Login attempt by blocked user: {}", user.getEmail());
            throw new BadCredentialsException("Account has been blocked. Reason: " +
                    (user.getBlockReason() != null ? user.getBlockReason() : "Contact administrator"));
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }


        if (user.isPasswordChangeRequired()) {
            return new LoginResponse(true, null);
        }

        UserDetails userDetails = buildUserDetails(user);

        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(false, token);
    }

    /**
     * Change password (used after first login)
     */
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangeRequired(false);

        userRepository.save(user);
    }

    /**
     * Convert User → UserDetails (kept private & clean)
     */
    private UserDetails buildUserDetails(User user) {
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(
                        user.getRoles()
                                .stream()
                                .map(r -> r.getRoleType())
                                .toArray(String[]::new)
                )
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }

    public RegisterResponse registerUser(RegisterRequest registerRequest){
        log.info("REGISTER REQUEST RECEIVED: {}",registerRequest.email());

        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new DuplicateResourceException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(registerRequest.password());
        Role role = roleRepository.findByRoleType(registerRequest.role())
                .orElseGet(() -> {
                    Role newRole = new Role(registerRequest.role());
                    return roleRepository.save(newRole);
                });
        User user=new User();
        user.setUsername(registerRequest.username());
        user.setEmail(registerRequest.email());
        user.setPassword(hashedPassword);
        user.setRoles(Set.of(role));
        userRepository.save(user);

        log.info("USER SAVED SUCCESSFULLY");
        log.info("User count = {}", userRepository.count());

        return new RegisterResponse("Registered Successfully");
    }


    @Transactional
    public void changePasswordFirstLogin(ChangePasswordRequest req) {

        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!user.isPasswordChangeRequired()) {
            throw new IllegalStateException("Password change not required");
        }

        if (!passwordEncoder.matches(req.oldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid temporary password");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword()));
        user.setPasswordChangeRequired(false);

        userRepository.save(user);
    }

    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            tokenBlacklistService.blacklistToken(jwtToken, securityUtil.getCurrentUserEmail());
            log.info("User logged out successfully, token blacklisted");
        } else {
            throw new IllegalArgumentException("Invalid token format");
        }
    }

}
