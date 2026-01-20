
package com.teamb.globalipbackend1.controller.auth;

import com.teamb.globalipbackend1.dto.user.ApiKeyResponse;
import com.teamb.globalipbackend1.dto.user.AdminApiKeyResponse;
import com.teamb.globalipbackend1.service.user.ApiKeyService;
import com.teamb.globalipbackend1.service.user.CreatedApiKey;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService service;

    /* ================= USER ================= */

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','ANALYST')")
    public CreatedApiKey create(
            Authentication authentication
    ) {
        return service.create(authentication);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','ANALYST')")
    public List<ApiKeyResponse> list(Authentication authentication) {
        return service.list(authentication)
                .stream()
                .map(ApiKeyResponse::from)
                .toList();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void revoke(
            @PathVariable Long id,
            Authentication authentication
    ) {
        service.revoke(id, authentication);
    }

    /* ================= ADMIN ================= */

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<@NonNull AdminApiKeyResponse> listAllApiKeys(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.listAllForAdmin(PageRequest.of(page, size))
                .map(AdminApiKeyResponse::from);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void adminRevoke(@PathVariable Long id) {
        service.adminRevoke(id);
    }
}
