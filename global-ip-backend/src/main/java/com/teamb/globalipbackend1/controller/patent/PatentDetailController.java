package com.teamb.globalipbackend1.controller.patent;

import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.service.bookmark.PatentBookmarkService;
import com.teamb.globalipbackend1.service.patent.PatentDetailService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestController
@RequestMapping("/api/patents")
@RequiredArgsConstructor
public class PatentDetailController {

    private final PatentDetailService detailService;
    private final PatentBookmarkService bookmarkService;

    @GetMapping("/{publicationNumber}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull GlobalPatentDetailDto> getDetail(
            @PathVariable String publicationNumber,
            Authentication auth
    ) {
        log.info("Received request for patent detail: {}", publicationNumber);
        String userId = auth.getName();

        try {
            GlobalPatentDetailDto detail = detailService.getPatentDetail(publicationNumber, userId);
            log.info("Successfully retrieved patent detail: {}", publicationNumber);
            return ResponseEntity.ok(detail);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Patent not found")) {
                log.warn("Patent not found: {}", publicationNumber);
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patent not found: " + publicationNumber,
                        e
                );
            }
            log.error("Failed to retrieve patent detail: {}", publicationNumber, e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve patent details",
                    e
            );
        }
    }

    @PostMapping("/{publicationNumber}/bookmark")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<Void> bookmark(
            @PathVariable String publicationNumber,
            @RequestParam String source,
            Authentication auth
    ) {
        bookmarkService.save(auth.getName(), publicationNumber, source);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{publicationNumber}/bookmark")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<Void> unbookmark(
            @PathVariable String publicationNumber,
            Authentication auth
    ) {
        bookmarkService.unsave(auth.getName(), publicationNumber);
        return ResponseEntity.noContent().build();
    }
}