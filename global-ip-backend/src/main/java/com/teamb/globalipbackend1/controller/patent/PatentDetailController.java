package com.teamb.globalipbackend1.controller.patent;

import com.teamb.globalipbackend1.dto.citation.CitationNetworkDTO;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.service.bookmark.PatentBookmarkService;
import com.teamb.globalipbackend1.service.patent.citations.PatentCitationService;
import com.teamb.globalipbackend1.service.patent.detail.PatentDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Patents", description = "Patent search, details, and bookmark APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class PatentDetailController {

    private final PatentDetailService detailService;
    private final PatentBookmarkService bookmarkService;
    private final PatentCitationService citationService;

    @Operation(
            summary = "Get patent details",
            description = "Returns detailed patent information for the given publication number.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Patent details retrieved",
                            content = @Content(schema = @Schema(implementation = GlobalPatentDetailDto.class))
                    ),
                    @ApiResponse(responseCode = "404", description = "Patent not found"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    @GetMapping("/{publicationNumber}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull GlobalPatentDetailDto> getDetail(
            @PathVariable String publicationNumber,
            Authentication auth
    ) {
        log.info("Received request for patent detail: {}", publicationNumber);
        String userId = auth.getName();
        try {

            GlobalPatentDetailDto detail =
                    detailService.getPatentDetail(publicationNumber, userId);


            citationService.fetchAndStoreCitations(publicationNumber);

            CitationNetworkDTO citationNetwork =
                    citationService.getCitationNetwork(publicationNumber);


            detail.setCitationNetwork(citationNetwork);

            return ResponseEntity.ok(detail);

        } catch (RuntimeException e) {
            log.error("Failed to fetch patent detail: {}", publicationNumber, e);

            if (e.getMessage() != null && e.getMessage().contains("Patent not found")) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patent not found: " + publicationNumber,
                        e
                );
            }

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve patent details",
                    e
            );
        }

    }


    @Operation(
            summary = "Bookmark patent",
            description = "Bookmarks a patent for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Patent bookmarked"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
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

    @Operation(
            summary = "Remove patent bookmark",
            description = "Removes a bookmarked patent for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Bookmark removed"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
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