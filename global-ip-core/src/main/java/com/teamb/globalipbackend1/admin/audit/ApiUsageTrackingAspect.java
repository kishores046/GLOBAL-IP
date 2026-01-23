package com.teamb.globalipbackend1.admin.audit;

import com.teamb.globalipbackend1.admin.repository.ApiUsageLogRepository;
import com.teamb.globalipbackend1.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class ApiUsageTrackingAspect {

    private final ApiUsageLogRepository repository;
    private final SecurityUtil securityUtil;

    @Around("@annotation(trackApiUsage)")
    public Object track(
            ProceedingJoinPoint pjp,
            TrackApiUsage trackApiUsage
    ) throws Throwable {

        long start = System.currentTimeMillis();
        String status = "SUCCESS";

        try {
            return pjp.proceed();
        } catch (Throwable ex) {
            status = "ERROR";
            throw ex;
        } finally {
            long duration = System.currentTimeMillis() - start;

            ApiUsageLog apiUsageLoglog = new ApiUsageLog();
            apiUsageLoglog.setService(trackApiUsage.service());
            apiUsageLoglog.setAction(resolveAction(trackApiUsage, pjp));
            apiUsageLoglog.setStatus(status);
            apiUsageLoglog.setResponseTimeMs(duration);
            apiUsageLoglog.setUserId(resolveUser());
            apiUsageLoglog.setTimestamp(
                    LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
            );
          writeLog(apiUsageLoglog);
            // ADD THIS LOG STATEMENT
            log.info("Saving API usage: service='{}', action='{}', status='{}',userId='{}'",
                    apiUsageLoglog.getService(), apiUsageLoglog.getAction(), apiUsageLoglog.getStatus(),apiUsageLoglog.getUserId());

        }
    }

    private String resolveUser() {
        try {
            return securityUtil.getUserId();
        } catch (Exception e) {
            return "SYSTEM";
        }
    }

    private String resolveAction(
            TrackApiUsage annotation,
            ProceedingJoinPoint pjp
    ) {
        if (!annotation.action().isBlank()) {
            return annotation.action();
        }

        Object[] args = pjp.getArgs();
        for (Object arg : args) {
            if (arg instanceof String path) {
                return deriveActionFromPath(path);
            }
        }

        return "UNKNOWN";
    }

    private String deriveActionFromPath(String path) {

        if (path == null) return "TREND_UNKNOWN";

        String p = path.toLowerCase();

        /* ===================== UNIFIED TRENDS ===================== */
        if (p.contains("/unified/trends/filings")) {
            return "TREND_UNIFIED_FILING";
        }
        if (p.contains("/unified/trends/countries")) {
            return "TREND_UNIFIED_COUNTRY";
        }


        if (p.contains("/filings")) {
            return "TREND_FILING";
        }
        if (p.contains("/grants")) {
            return "TREND_GRANT";
        }
        if (p.contains("/technologies/top")) {
            return "TREND_TECHNOLOGY_TOP";
        }
        if (p.contains("/technologies/evolution")) {
            return "TREND_TECHNOLOGY_EVOLUTION";
        }
        if (p.contains("/technologies/crossovers")) {
            return "TREND_TECHNOLOGY_CROSSOVER";
        }
        if (p.contains("/assignees/top")) {
            return "TREND_ASSIGNEE_TOP";
        }
        if (p.contains("/assignees/technology-focus")) {
            return "TREND_ASSIGNEE_TECH_FOCUS";
        }
        if (p.contains("/assignees/innovation-velocity")) {
            return "TREND_ASSIGNEE_INNOVATION";
        }
        if (p.contains("/citations/top-cited")) {
            return "TREND_CITATION_TOP_CITED";
        }
        if (p.contains("/citations/top-citing")) {
            return "TREND_CITATION_TOP_CITING";
        }
        if (p.contains("/citations/lag")) {
            return "TREND_CITATION_LAG";
        }
        if (p.contains("/patents/type-distribution")) {
            return "TREND_PATENT_TYPE";
        }
        if (p.contains("/patents/claim-complexity")) {
            return "TREND_CLAIM_COMPLEXITY";
        }
        if (p.contains("/patents/time-to-grant")) {
            return "TREND_TIME_TO_GRANT";
        }
        if (p.contains("/summary")) {
            return "TREND_YEAR_SUMMARY";
        }
        if (p.contains("/countries")) {
            return "TREND_COUNTRY";
        }


        if (p.contains("/epo/trends/filings")) {
            return "TREND_EPO_FILING";
        }
        if (p.contains("/epo/trends/countries")) {
            return "TREND_EPO_COUNTRY";
        }
        if (p.contains("/epo/trends/technologies")) {
            return "TREND_EPO_TECHNOLOGY";
        }
        if (p.contains("/epo/trends/assignees")) {
            return "TREND_EPO_ASSIGNEE";
        }
        if (p.contains("/epo/trends/families")) {
            return "TREND_EPO_FAMILY_SIZE";
        }


        return "TREND_OTHER";
    }

     @Async
    public void writeLog(ApiUsageLog log){
        repository.save(log);
    }

}