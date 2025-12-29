package com.teamb.globalipbackend1.controller.user;

import com.teamb.globalipbackend1.dto.trademark.BookmarkedTrademarkDto;
import com.teamb.globalipbackend1.service.bookmark.TrademarkBookmarkService;
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
public class UserTrademarkBookmarkController {

    private final TrademarkBookmarkService bookmarkQueryService;

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
