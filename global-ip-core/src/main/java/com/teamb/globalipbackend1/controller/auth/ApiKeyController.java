package com.teamb.globalipbackend1.controller.auth;

import com.sun.security.auth.UserPrincipal;
import com.teamb.globalipbackend1.dto.user.ApiKeyResponse;
import com.teamb.globalipbackend1.service.user.ApiKeyService;
import com.teamb.globalipbackend1.service.user.CreatedApiKey;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings/api-keys")
@PreAuthorize("hasAnyRole('ADMIN','USER','ANALYST')")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService service;

    @PostMapping
    public CreatedApiKey create(
            Authentication authentication,
            @RequestParam String name
    ) {
        return service.create(authentication,name);
    }

    @GetMapping
    public List<ApiKeyResponse> list(
            Authentication authentication
    ) {
        return service.list(authentication)
                .stream()
                .map(ApiKeyResponse::from)
                .toList();
    }

    @DeleteMapping("/{id}")
    public void revoke(
            @PathVariable Long id,
            Authentication authentication
    ) {
        service.revoke(id,authentication);
    }
}
