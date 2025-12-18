package com.teamb.globalipbackend1.service.auth;

import com.teamb.globalipbackend1.dto.security.JwtResponse;
import com.teamb.globalipbackend1.dto.authentication.*;
import com.teamb.globalipbackend1.exception.DuplicateResourceException;
import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.RoleRepository;
import com.teamb.globalipbackend1.repository.UserRepository;
import com.teamb.globalipbackend1.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {


    @Autowired
    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, UserRepository userRepository, RoleRepository roleRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;

    }

    private final RoleRepository roleRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private  final PasswordEncoder passwordEncoder;


    private final UserRepository userRepository;

    public RegisterResponse registerUser(RegisterRequest registerRequest){
        System.out.println("REGISTER REQUEST RECEIVED: " + registerRequest.email());

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

        System.out.println("USER SAVED SUCCESSFULLY");
        System.out.println("User count = " + userRepository.count());

        return new RegisterResponse("Registered Successfully");
    }
    public JwtResponse authenticate(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        return new JwtResponse(token);
    }

    }
