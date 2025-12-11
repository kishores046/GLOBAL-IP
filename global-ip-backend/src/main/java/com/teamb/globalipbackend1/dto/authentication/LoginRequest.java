package com.teamb.globalipbackend1.dto.authentication;


import com.teamb.globalipbackend1.util.validUtils.valid.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull @Email String email,
        @Password String password) {}
