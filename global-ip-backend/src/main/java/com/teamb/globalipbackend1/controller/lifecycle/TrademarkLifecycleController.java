package com.teamb.globalipbackend1.controller.lifecycle;

import com.teamb.globalipbackend1.dto.lifecycle.TrademarkLifecycleDto;
import com.teamb.globalipbackend1.model.lifecycle.UserTrademarkLifecycle;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.patent.lifecycle.TrademarkLifecyclePersistenceService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
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
@RequestMapping("/api/analyst/trademarks")
public class TrademarkLifecycleController {

    private final TrademarkDetailService trademarkDetailService;
    private final TrademarkLifecyclePersistenceService lifecycleService;
    private final SecurityUtil securityUtil;

    /**
     * Fetch → compute lifecycle → persist → return
     */
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
    @GetMapping("/lifecycle")
    public ResponseEntity<@NonNull List<UserTrademarkLifecycle>> dashboard() {
        String userId = securityUtil.getUserId();
        return ResponseEntity.ok(
                lifecycleService.getAllForUser(userId)
        );
    }
}
