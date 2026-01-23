package com.teamb.globalipbackend1.admin.service;

import com.teamb.globalipbackend1.admin.dto.ErrorSummaryDto;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ErrorSummaryService {

    private final ApiUsageLogRepository repo;

    public List<ErrorSummaryDto> summary() {

        LocalDateTime since = LocalDateTime.now().minusHours(24);

        return repo.errorSummary(since)
                .stream()
                .map(r -> {
                    String service = (String) r[0];
                    long total = (long) r[1];
                    long errors = (long) r[2];
                    double rate = total == 0 ? 0 : (double) errors / total;

                    return new ErrorSummaryDto(service, total, errors, rate);
                })
                .toList();
    }
}
