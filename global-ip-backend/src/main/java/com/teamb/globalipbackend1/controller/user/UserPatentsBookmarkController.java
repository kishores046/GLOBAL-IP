package com.teamb.globalipbackend1.controller.user;


import com.teamb.globalipbackend1.dto.patent.BookmarkedPatentDto;

import com.teamb.globalipbackend1.service.bookmark.PatentBookmarkService;
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
public class UserPatentsBookmarkController {

    private final PatentBookmarkService bookmarkQueryService;


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

