package com.teamb.globalipbackend1.admin.service;

import com.teamb.globalipbackend1.admin.dto.AdminOverviewDto;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import com.teamb.globalipbackend1.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOverviewService {

    private final ApiUsageLogRepository logs;
    private final UserRepository users;

    public AdminOverviewDto overview() {

        LocalDateTime startOfDay =
                LocalDate.now().atStartOfDay();

        long totalUsers = users.count();
        long activeUsers = logs.activeUsers(LocalDateTime.now().minusHours(24));
        long requestsToday = logs.requestsSince(startOfDay);
        long errorsToday = logs.errorsSince(startOfDay);

        String topService = top(logs.usageByService());
        String topAction = top(logs.usageByAction());

        return new AdminOverviewDto(
                totalUsers,
                activeUsers,
                requestsToday,
                errorsToday,
                topService,
                topAction
        );
    }

    private String top(List<Object[]> rows) {
        if (rows.isEmpty()) return "N/A";
        return String.valueOf(rows.getFirst()[0]);
    }
}
