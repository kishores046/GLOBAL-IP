package com.teamb.globalipbackend1.service.search;


import com.teamb.globalipbackend1.model.user.SearchActivity;
import com.teamb.globalipbackend1.model.user.User;
import com.teamb.globalipbackend1.repository.user.SearchActivityRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@AllArgsConstructor
@Slf4j
public class SearchActivityService {

    private final SearchActivityRepository searchActivityRepository;
    private final UserRepository userRepository;


    public void incrementSearchCount(String searchMode) {
        User user = getCurrentUser();
        SearchActivity activity=new SearchActivity(searchMode, user.getUser_id());
        searchActivityRepository.save(activity);
        log.info("Search activity logged: {}", activity);
    }

    public Long getAnalystSearchCount(){
        User user = getCurrentUser();
        return searchActivityRepository.countByUserId(user.getUser_id());
    }

    private User getCurrentUser() {
        var email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.error("No user exists by the email,{}", email);
            return new RuntimeException("No user exists by the email");
        });
        log.info("User exists,{}",email);
        return user;
    }
}
