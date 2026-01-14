package com.teamb.globalipbackend1.controller.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.detail.GlobalPatentDetailsService;
import com.teamb.globalipbackend1.service.patent.detail.PatentsViewDetailsService;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
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
@RequestMapping("/api/analyst/patents")
public class PatentLifecycleController {

    private final PatentsViewDetailsService patentsViewDetailsService;
    private final PatentLifecyclePersistenceService lifecycleService;
    private final SecurityUtil securityUtil;
    private final GlobalPatentDetailsService globalPatentDetailsService;
    /* ===================== COMPUTE + SAVE ===================== */


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
