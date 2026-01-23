package com.teamb.globalipbackend1.controller.auth;

import com.teamb.globalipbackend1.dto.security.JwtResponse;
import com.teamb.globalipbackend1.dto.authentication.*;
import com.teamb.globalipbackend1.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(
        name = "Authentication",
        description = "Authentication and authorization APIs (Register, Login, JWT issuance)"
)
public class AuthController {

    private final AuthService authService;
    @Operation(
            summary = "Register a new user",
            description = "Registers a new user in the system. Does not return JWT.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User registered successfully",
                            content = @Content(schema = @Schema(implementation = RegisterResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Validation error",
                            content = @Content
                    )
            }
    )
    @PostMapping("/register")
    public ResponseEntity<@NonNull RegisterResponse> register(@Valid @RequestBody RegisterRequest req) {
        authService.registerUser(req);
        return ResponseEntity.ok(new RegisterResponse("Registered Successfully"));
    }


    @Operation(
            summary = "Login",
            description = "Authenticates user credentials and issues a JWT.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Login successful, JWT issued",
                            content = @Content(schema = @Schema(implementation = LoginResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Invalid credentials",
                            content = @Content
                    )
            }
    )
    @PostMapping("/login")
    public ResponseEntity<@NonNull LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    /**
     * Change password (first login or normal change)
     */
    @Operation(
            summary = "Change password",
            description = "Allows authenticated users to change their password (first login or regular change).",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Password changed successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "400", description = "Invalid request")
            }
    )
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
           @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePasswordFirstLogin(request);
        return ResponseEntity.ok(
                Map.of("message", "Password changed successfully")
        );
    }


    @Operation(
            summary = "Logout",
            description = "Invalidates the JWT token and logs the user out.",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Logged out successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String token
    ) {
        authService.logout(token);
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }




}