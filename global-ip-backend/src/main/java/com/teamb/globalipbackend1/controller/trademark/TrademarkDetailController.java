package com.teamb.globalipbackend1.controller.trademark;

import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.service.bookmark.TrademarkBookmarkService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trademarks")
@RequiredArgsConstructor
public class TrademarkDetailController {

    private final TrademarkDetailService detailService;
    private final TrademarkBookmarkService bookmarkService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ANALYST','ADMIN')")
    public ResponseEntity<@NonNull GlobalTrademarkDetailDto> getDetail(
            @PathVariable String id,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                detailService.getTrademarkDetail(id, auth.getName())
        );
    }

    @PostMapping("/{id}/bookmark")
    @PreAuthorize("hasAnyRole('USER','ANALYST','ADMIN')")
    public ResponseEntity<Void> bookmark(
            @PathVariable String id,
            @RequestParam String source,
            Authentication auth
    ) {
        bookmarkService.save(auth.getName(), id, source);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/bookmark")
    @PreAuthorize("hasAnyRole('USER','ANALYST','ADMIN')")
    public ResponseEntity<Void> unbookmark(
            @PathVariable String id,
            Authentication auth
    ) {
        bookmarkService.unsave(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
