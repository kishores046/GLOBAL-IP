package com.teamb.globalipbackend1.security;

import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    private final UserRepository userRepository;

    public SecurityUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getCurrentUserEmail() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        return authentication.getName();  // email is the username
    }

    public  String getUserId(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        User user= userRepository.findByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("No user found"));
        return user.getUserId();

    }
}

