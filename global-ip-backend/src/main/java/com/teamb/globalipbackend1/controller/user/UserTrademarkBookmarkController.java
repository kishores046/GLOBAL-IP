package com.teamb.globalipbackend1.controller.user;

import com.teamb.globalipbackend1.dto.trademark.BookmarkedTrademarkDto;
import com.teamb.globalipbackend1.service.bookmark.TrademarkBookmarkService;
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
@Tag(name = "User Bookmarks", description = "User trademark bookmarks APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UserTrademarkBookmarkController {

    private final TrademarkBookmarkService bookmarkQueryService;

    @Operation(
            summary = "Get bookmarked trademarks of the logged-in user",
            description = """
        Returns all trademarks bookmarked by the currently authenticated user.
        The user identity is resolved from the JWT token.
        """,
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "List of bookmarked trademarks",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = BookmarkedTrademarkDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - JWT token missing or invalid"
                    )
            }
    )

    @GetMapping("/trademarks")
    @PreAuthorize("hasAnyRole('USER','ADMIN','ANALYST')")
    public ResponseEntity<@NonNull List<BookmarkedTrademarkDto>> getMyBookmarkedTrademarks(
            Authentication auth
    ) {
        String userId = auth.getName();
        return ResponseEntity.ok(
                bookmarkQueryService.getBookmarkedTrademarks(userId)
        );
    }
}
