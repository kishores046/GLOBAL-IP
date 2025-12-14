package com.teamb.globalipbackend1.config;

import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.RoleRepository;
import com.teamb.globalipbackend1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createAdminOnStartup() {
        return args -> {

            // Check if admin exists
            if (userRepository.existsByEmail("admin@gip.com")) {
                System.out.println("✔ Admin already exists. Skipping creation.");
                return;
            }

            // Ensure ADMIN role exists
            Role adminRole = roleRepository.findByRoleType("ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role("ADMIN");
                        return roleRepository.save(newRole);
                    });

            // Create admin user
            User admin = new User(
                    "admin",
                    "admin@gip.com",
                    passwordEncoder.encode("admin123"),
                    Set.of(adminRole)
            );

            userRepository.save(admin);
            System.out.println("============Admin user created → admin@gip.com / admin123==============");
        };
    }
}

