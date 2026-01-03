package com.teamb.globalipbackend1.controller.user;

import com.teamb.globalipbackend1.dto.user.UpdateProfileRequest;
import com.teamb.globalipbackend1.dto.user.UpdateProfileResponse;
import com.teamb.globalipbackend1.dto.user.UserProfileResponse;
import com.teamb.globalipbackend1.service.search.SearchActivityService;
import com.teamb.globalipbackend1.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User", description = "User profile and dashboard APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController{


    private final UserService userService;
    private final SearchActivityService searchActivityService;


    @Operation(
            summary = "Get user profile",
            description = "Returns profile details of the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Profile retrieved"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public UserProfileResponse getProfile() {
        return userService.getLoggedInUserProfile();
    }

    @Operation(
            summary = "Update user profile",
            description = "Updates profile details of the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Profile updated")
            }
    )
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public UpdateProfileResponse updateProfile(@RequestBody UpdateProfileRequest request) {
       return  userService.updateProfile(request);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok("User Dashboard Data");
    }


    @Operation(
            summary = "Get user search count",
            description = "Returns total number of searches performed by the user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Search count returned"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    @GetMapping("/dashboard/my/searchCount")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<@NonNull Long> searchCount(){
        return ResponseEntity.ok(searchActivityService.getAnalystSearchCount());
    }

}