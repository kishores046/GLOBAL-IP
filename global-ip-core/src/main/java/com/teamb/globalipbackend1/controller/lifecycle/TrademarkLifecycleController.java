package com.teamb.globalipbackend1.controller.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.TrademarkLifecycleDto;
import com.teamb.globalipbackend1.model.lifecycle.UserTrademarkLifecycle;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.lifecycle.TrademarkLifecyclePersistenceService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ANALYST','ADMIN')")
@Tag(
        name = "Trademark Lifecycle",
        description = "APIs for computing and tracking trademark lifecycles"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@RequestMapping("/api/analyst/trademarks")
public class TrademarkLifecycleController {

    private final TrademarkDetailService trademarkDetailService;
    private final TrademarkLifecyclePersistenceService lifecycleService;
    private final SecurityUtil securityUtil;

    /**
     * Fetch → compute lifecycle → persist → return
     */

    @Operation(
            summary = "Get trademark lifecycle",
            description = "Fetches, computes, persists, and returns the lifecycle of a trademark.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Trademark lifecycle returned successfully"),
                    @ApiResponse(responseCode = "404", description = "Trademark not found")
            }
    )

    @GetMapping("/{trademarkId}/lifecycle")
    public ResponseEntity<@NonNull TrademarkLifecycleDto> getLifecycle(
            @PathVariable String trademarkId
    ) {
        String userId = securityUtil.getUserId();

        TrademarkLifecycleDto lifecycle =
                trademarkDetailService.computeAndPersistLifecycle(
                        trademarkId,
                        userId
                );

        return ResponseEntity.ok(lifecycle);
    }

    /**
     * Dashboard: all tracked trademark lifecycles
     */
    @Operation(
            summary = "List tracked trademark lifecycles",
            description = "Returns all trademark lifecycles tracked by the logged-in user for dashboard views.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracked trademark lifecycles returned successfully")
            }
    )
    @GetMapping("/lifecycle")
    public ResponseEntity<@NonNull List<UserTrademarkLifecycle>> dashboard() {
        String userId = securityUtil.getUserId();
        return ResponseEntity.ok(
                lifecycleService.getAllForUser(userId)
        );
    }
}
