package com.teamb.globalipbackend1.controller.user;

import com.teamb.globalipbackend1.dto.ApiResponse;
import com.teamb.globalipbackend1.dto.user.UpdateProfileRequest;
import com.teamb.globalipbackend1.dto.user.UpdateProfileResponse;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor

public class UserController{


    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public UserProfileResponse getProfile() {
        return userService.getLoggedInUserProfile();
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public UpdateProfileResponse updateProfile(@RequestBody UpdateProfileRequest request) {
       return  userService.updateProfile(request);
    }

}