package com.teamb.globalipbackend1.admin.service;


import com.teamb.globalipbackend1.admin.audit.ApiUsageLog;
import com.teamb.globalipbackend1.admin.dto.ApiUsageLogDto;
import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsageLogService {

    private final ApiUsageLogRepository repo;

    public Page<@NonNull ApiUsageLogDto> getFilteredLogs(
            String service,
            String status,
            String action,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    ) {
        Specification<@NonNull ApiUsageLog> spec = buildSpecification(
                service, status, action, startDate, endDate
        );

        return repo.findAll(spec, pageable)
                .map(this::toDto);
    }

    public byte[] exportToCsv(
            String service,
            String status,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        List<ApiUsageLog> logs = repo.findAll(
                buildSpecification(service, status, null, startDate, endDate)
        );

        return generateCsv(logs);
    }

    private Specification<@NonNull ApiUsageLog> buildSpecification(
            String service,
            String status,
            String action,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (service != null && !service.equals("All APIs")) {
                predicates.add(cb.equal(root.get("service"), service));
            }
            if (status != null && !status.equals("All Status")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (action != null) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private ApiUsageLogDto toDto(ApiUsageLog log) {
        return new ApiUsageLogDto(
                log.getId(),
                log.getTimestamp(),
                log.getService(),
                log.getAction(),
                log.getStatus(),
                log.getResponseTimeMs(),
                log.getUserId()
        );
    }

    private byte[] generateCsv(List<ApiUsageLog> logs) {
        StringBuilder csv = new StringBuilder();
        csv.append("Timestamp,API Source,Action,Status,Response Time,User\n");

        logs.forEach(log -> csv.append(String.format("%s,%s,%s,%s,%dms,%s\n",
                log.getTimestamp(),
                log.getService(),
                log.getAction(),
                log.getStatus(),
                log.getResponseTimeMs(),
                log.getUserId()
        )));

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }
}