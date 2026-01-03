package com.teamb.globalipbackend1.controller.user;


import com.teamb.globalipbackend1.dto.patent.BookmarkedPatentDto;

import com.teamb.globalipbackend1.service.bookmark.PatentBookmarkService;
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

import java.util.List;

@RestController
@RequestMapping("/api/users/me/bookmarks")
@RequiredArgsConstructor
@Tag(name = "User Bookmarks", description = "User patent bookmarks APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UserPatentsBookmarkController {

    private final PatentBookmarkService bookmarkQueryService;


    @Operation(
            summary = "Get bookmarked patents",
            description = "Returns all patents bookmarked by the logged-in user.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Bookmarked patents list",
                            content = @Content(schema = @Schema(implementation = BookmarkedPatentDto.class))
                    )
            }
    )
    @GetMapping("/patents")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull List<BookmarkedPatentDto>> getMyBookmarkedPatents(
            Authentication auth
    ) {
        String userId = auth.getName();
        return ResponseEntity.ok(
                bookmarkQueryService.getBookmarkedPatents(userId)
        );
    }
}

