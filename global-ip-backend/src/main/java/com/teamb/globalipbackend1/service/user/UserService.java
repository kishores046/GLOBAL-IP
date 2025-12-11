package com.teamb.globalipbackend1.service.user;

import com.teamb.globalipbackend1.dto.user.UpdateProfileRequest;
import com.teamb.globalipbackend1.dto.user.UpdateProfileResponse;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.model.User;
import com.teamb.globalipbackend1.repository.UserRepository;
import com.teamb.globalipbackend1.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final SecurityUtil securityUtil;

    public User getLoggedInUser() {
        String email = securityUtil.getCurrentUserEmail();

        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileResponse getLoggedInUserProfile() {
        User user = getLoggedInUser();

        return new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream()
                        .map(role -> role.getRoleType())
                        .collect(Collectors.toSet()),
                user.getPhoneNumber(),
                user.getCompany(),
                user.getLocation(),
                user.getPosition(),
                user.getBio()
        );
    }

    public UpdateProfileResponse updateProfile(UpdateProfileRequest request) {


        User user = getLoggedInUser();

        if (request.username() != null && !request.username().isBlank()) {
            user.setUsername(request.username());
        }

        if (request.company()!= null && !request.company().isBlank()) {
            user.setCompany(request.company());
        }

        if (request.phoneNumber() != null && !request.phoneNumber().isBlank()) {
            user.setPhoneNumber(request.phoneNumber());
        }

        if (request.position() != null && !request.position().isBlank()) {
            user.setPosition(request.position());
        }

        if (request.bio()!=null && !request.bio().isBlank()){
            user.setBio(request.bio());
        }

        if (request.location()!=null && !request.location().isBlank()){
            user.setLocation(request.location());
        }

        userRepository.save(user);
        System.out.println("Updated Successfully");
        return new UpdateProfileResponse(user.getUsername(), user.getPhoneNumber(), user.getLocation(), user.getCompany(),user.getPosition(), user.getBio());

    }
}