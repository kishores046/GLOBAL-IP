package com.teamb.globalipbackend1.controller.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.detail.GlobalPatentDetailsService;
import com.teamb.globalipbackend1.service.patent.detail.PatentsViewDetailsService;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
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
        name = "Patent Lifecycle",
        description = "APIs for computing, tracking, and retrieving patent application lifecycles"
)
@SecurityRequirement(name = "Bearer Authentication")
@SecurityRequirement(name = "ApiKey Authentication")
@RequestMapping("/api/analyst/patents")
public class PatentLifecycleController {

    private final PatentsViewDetailsService patentsViewDetailsService;
    private final PatentLifecyclePersistenceService lifecycleService;
    private final SecurityUtil securityUtil;
    private final GlobalPatentDetailsService globalPatentDetailsService;

    @Operation(
            summary = "Get patent lifecycle",
            description = "Fetches and returns the computed lifecycle of a patent application "
                    + "using its publication number.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lifecycle returned successfully"),
                    @ApiResponse(responseCode = "404", description = "Patent not found")
            }
    )
    @GetMapping("/{publicationNumber}/lifecycle")
    public ResponseEntity<@NonNull ApplicationLifecycleDto> getPatentLifecycle(
            @PathVariable String publicationNumber
    ) {

        GlobalPatentDetailDto detail =
                globalPatentDetailsService.fetchGlobalDetail(publicationNumber);

        if (detail == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(detail.getApplicationLifecycleDto());
    }

    /* ===================== LISTING ===================== */

    /**
     * List all patents tracked by the logged-in user
     */
    @Operation(
            summary = "List tracked patents",
            description = "Returns lifecycle data for all patents tracked by the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracked patents returned successfully")
            }
    )
    @GetMapping("/tracked")
    public ResponseEntity<@NonNull List<ApplicationLifecycleDto>> getTrackedPatents() {

        String userId = securityUtil.getUserId();
        log.info("[LIFECYCLE] Fetch tracked patents for user={}", userId);

        return ResponseEntity.ok(
                lifecycleService.getTrackedPatents(userId)
        );
    }

    /**
     * Get lifecycle of a specific tracked patent
     */

    @Operation(
            summary = "Get tracked patent lifecycle",
            description = "Returns lifecycle data for a specific tracked patent of the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tracked patent lifecycle returned"),
                    @ApiResponse(responseCode = "404", description = "Tracked patent not found")
            }
    )
    @GetMapping("/tracked/{publicationNumber}")
    public ResponseEntity<@NonNull ApplicationLifecycleDto> getTrackedPatent(
            @PathVariable String publicationNumber
    ) {

        String userId = securityUtil.getUserId();
        log.info("[LIFECYCLE] Fetch tracked patent={} for user={}",
                publicationNumber, userId);

        ApplicationLifecycleDto dto =
                lifecycleService.getTrackedPatent(userId, publicationNumber);

        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }
}
