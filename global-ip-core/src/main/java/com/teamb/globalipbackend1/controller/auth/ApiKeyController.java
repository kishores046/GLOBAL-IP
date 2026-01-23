
package com.teamb.globalipbackend1.controller.auth;

import com.teamb.globalipbackend1.dto.user.ApiKeyResponse;
import com.teamb.globalipbackend1.dto.user.AdminApiKeyResponse;
import com.teamb.globalipbackend1.service.user.ApiKeyService;
import com.teamb.globalipbackend1.service.user.CreatedApiKey;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(
        name = "API Keys",
        description = "Manage API keys for programmatic and analytics access"
)
@SecurityRequirement(name = "Bearer Authentication")
public class ApiKeyController {

    private final ApiKeyService service;

    @Operation(
            summary = "Create API key",
            description = "Creates a new API key for the authenticated user. "
                    + "API keys are used for programmatic and analytics access.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "API key created successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','ANALYST')")
    public CreatedApiKey create(
            Authentication authentication
    ) {
        return service.create(authentication);
    }


    @Operation(
            summary = "List my API keys",
            description = "Returns all API keys created by the authenticated user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "API keys retrieved successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER','ANALYST')")
    public List<ApiKeyResponse> list(Authentication authentication) {
        return service.list(authentication)
                .stream()
                .map(ApiKeyResponse::from)
                .toList();
    }

    @Operation(
            summary = "Revoke API key",
            description = "Revokes an API key by ID. Only administrators are allowed to revoke user API keys.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "API key revoked successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden"),
                    @ApiResponse(responseCode = "404", description = "API key not found")
            }
    )



    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void revoke(
            @PathVariable Long id,
            Authentication authentication
    ) {
        service.revoke(id, authentication);
    }



    @Operation(
            summary = "List all API keys (admin)",
            description = "Returns a paginated list of all API keys in the system. "
                    + "Accessible only by administrators.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "API keys retrieved successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<@NonNull AdminApiKeyResponse> listAllApiKeys(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.listAllForAdmin(PageRequest.of(page, size))
                .map(AdminApiKeyResponse::from);
    }


    @Operation(
            summary = "Admin revoke API key",
            description = "Allows administrators to revoke any API key by ID.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "API key revoked successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden"),
                    @ApiResponse(responseCode = "404", description = "API key not found")
            }
    )

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void adminRevoke(@PathVariable Long id) {
        service.adminRevoke(id);
    }
}
