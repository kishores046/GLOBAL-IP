package com.teamb.globalipbackend1.dto.authentication;

import com.teamb.globalipbackend1.model.Role;
import com.teamb.globalipbackend1.util.validUtils.valid.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record RegisterRequest(
      @NotNull(message = "Username cannot be null")  @Size(min=2,max=100,message = "Username must be between the size 2 to 100") String username,
      @NotNull @NotBlank(message = "User Email must not be blank") @Email(message = "Invalid email id") String email,
      @NotBlank @Password(message = "Weak Password") String password,
      @NotNull(message = "Role can't be empty") String role
) {}
