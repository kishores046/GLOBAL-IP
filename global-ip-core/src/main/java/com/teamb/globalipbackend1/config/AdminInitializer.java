package com.teamb.globalipbackend1.config;

import com.teamb.globalipbackend1.model.user.Role;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.RoleRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("prod")
    public CommandLineRunner createAdminOnStartup() {
        return args -> {

            String adminEmail = System.getenv("BOOTSTRAP_ADMIN_EMAIL");
            String adminPassword = System.getenv("BOOTSTRAP_ADMIN_PASSWORD");

            if (adminEmail == null || adminPassword == null) {
                log.warn("Admin bootstrap skipped: environment variables not set");
                return;
            }

            if (userRepository.existsByEmail(adminEmail)) {
                log.info("Admin user already exists: {}", adminEmail);
                return;
            }

            Role adminRole = roleRepository.findByRoleType("ADMIN")
                    .orElseGet(() -> {
                        log.info("ADMIN role not found. Creating role.");
                        return roleRepository.save(new Role("ADMIN"));
                    });

            User admin = new User(
                    "admin",
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    Set.of(adminRole)
            );

            admin.setPasswordChangeRequired(true);

            userRepository.save(admin);

            log.info("Admin user created successfully: {}", adminEmail);
        };
    }
}
