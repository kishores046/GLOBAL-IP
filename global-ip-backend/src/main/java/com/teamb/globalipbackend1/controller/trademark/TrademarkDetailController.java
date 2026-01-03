package com.teamb.globalipbackend1.controller.trademark;

import com.teamb.globalipbackend1.dto.trademark.GlobalTrademarkDetailDto;
import com.teamb.globalipbackend1.service.bookmark.TrademarkBookmarkService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
import com.teamb.globalipbackend1.service.trademark.TrademarkDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trademarks")
@RequiredArgsConstructor
@Tag(name = "Trademarks", description = "Trademark detail and bookmark APIs")
@SecurityRequirement(name = "Bearer Authentication")public class TrademarkDetailController {

    private final TrademarkDetailService detailService;
    private final TrademarkBookmarkService bookmarkService;


    @Operation(
            summary = "Get trademark details",
            description = "Returns detailed trademark information for the given trademark ID.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Trademark details retrieved",
                            content = @Content(schema = @Schema(implementation = GlobalTrademarkDetailDto.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
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


    @Operation(
            summary = "Bookmark trademark",
            description = "Bookmarks a trademark for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Trademark bookmarked")
            }
    )
    @PostMapping("/{id}/bookmark")
    @PreAuthorize("hasAnyRole('USER','ANALYST','ADMIN')")
    public ResponseEntity<Void> bookmark(
            @PathVariable String id,
            @RequestParam(defaultValue = "TMVIEW") String source,
            Authentication auth
    ) {
        bookmarkService.save(auth.getName(), id, source);
        return ResponseEntity.ok().build();
    }


    @Operation(
            summary = "Remove trademark bookmark",
            description = "Removes a bookmarked trademark for the logged-in user.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Bookmark removed")
            }
    )

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
