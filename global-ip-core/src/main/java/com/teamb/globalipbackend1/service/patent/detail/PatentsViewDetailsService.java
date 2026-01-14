package com.teamb.globalipbackend1.service.patent.detail;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewHttpClient;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentDetailDto;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewCpcCurrent;
import com.teamb.globalipbackend1.external.patentsview.querybuilder.PatentsViewQueryBuilder;
import com.teamb.globalipbackend1.security.SecurityUtil;
import com.teamb.globalipbackend1.service.lifecycle.PatentLifecycleCalculator;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentLifecyclePersistenceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.StreamSupport;

@Slf4j
@Service
public class PatentsViewDetailsService {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewQueryBuilder queryBuilder;
    private final ObjectMapper objectMapper;
    private final PatentLifecyclePersistenceService lifecyclePersistenceService;
    private final SecurityUtil securityUtil;

    public PatentsViewDetailsService(
            PatentsViewHttpClient httpClient,
            PatentsViewQueryBuilder queryBuilder,
            @Qualifier("jsonObjectMapper") ObjectMapper objectMapper,
            PatentLifecyclePersistenceService lifecyclePersistenceService,
            SecurityUtil securityUtil
    ) {
        this.httpClient = httpClient;
        this.queryBuilder = queryBuilder;
        this.objectMapper = objectMapper;
        this.lifecyclePersistenceService = lifecyclePersistenceService;
        this.securityUtil = securityUtil;
    }

    /* ===================== RAW FETCH ===================== */

    public PatentDetailDto fetchPatentDetail(String publicationNumber) {

        try {
            String query = queryBuilder.buildPatentDetailQuery(publicationNumber);
            String response = httpClient.post(query);

            JsonNode root = objectMapper.readTree(response);
            JsonNode patents = root.path("patents");

            if (!patents.isArray() || patents.isEmpty()) {
                return tryAlternativeFormats(publicationNumber);
            }

            return parsePatentNode(patents.get(0));

        } catch (Exception e) {
            log.error("PatentsView detail fetch failed: {}", publicationNumber, e);
            return null;
        }
    }

    /* ===================== PARSER ===================== */

    private PatentDetailDto parsePatentNode(JsonNode p) {

        PatentDetailDto dto = new PatentDetailDto();

        String patentId = p.path("patent_id").asText(null);
        LocalDate filingDate = parseDate(p, "patent_earliest_application_date");
        LocalDate grantDate = parseDate(p, "patent_date");
        LocalDate expirationDate = parseDate(p, "patent_expiration_date");
        boolean withdrawn = p.path("withdrawn").asBoolean(false);

        dto.setPatentId(patentId);
        dto.setTitle(p.path("patent_title").asText(null));
        dto.setAbstractText(p.path("patent_abstract").asText(null));
        dto.setFillingDate(filingDate);
        dto.setGrantDate(grantDate);
        dto.setWipoKind(p.path("wipo_kind").asText(null));

        dto.setTimesCited(p.path("patent_num_times_cited_by_us_patents").asInt(0));
        dto.setTotalCitations(p.path("patent_num_total_documents_cited").asInt(0));

        dto.setAssignees(extractAssignees(p));
        dto.setInventors(extractInventors(p));

        dto.setCpcClasses(
                objectMapper.convertValue(
                        p.path("cpc_current"),
                        new TypeReference<List<PatentsViewCpcCurrent>>() {}
                )
        );


        ApplicationLifecycleDto lifecycle =
                PatentLifecycleCalculator.compute(
                        patentId,
                        filingDate,
                        grantDate,
                        expirationDate,
                        withdrawn
                );

        dto.setLifecycle(lifecycle);

        log.info("Parsed patent={} lifecycle={}", patentId, lifecycle.status());
        return dto;
    }

    /* ===================== GLOBAL DETAIL (USER CONTEXT) ===================== */

    public GlobalPatentDetailDto fetchGlobalDetail(String publicationNumber) {

        PatentDetailDto pv = fetchPatentDetail(publicationNumber);
        if (pv == null) return null;

        String userId = securityUtil.getUserId();

        ApplicationLifecycleDto lifecycle = pv.getLifecycle();

        lifecyclePersistenceService.saveLifecycle(
                userId,
                pv.getLifecycle()
        );

        GlobalPatentDetailDto dto = new GlobalPatentDetailDto();
        dto.setPublicationNumber(pv.getPatentId());
        dto.setJurisdiction("US");
        dto.setSource("PatentsView");
        dto.setTitle(pv.getTitle());
        dto.setAbstractText(pv.getAbstractText());
        dto.setFilingDate(pv.getFillingDate());
        dto.setGrantDate(pv.getGrantDate());
        dto.setWipoKind(pv.getWipoKind());
        dto.setAssignees(pv.getAssignees());
        dto.setInventors(pv.getInventors());
        dto.setTimesCited(pv.getTimesCited());
        dto.setTotalCitations(pv.getTotalCitations());

        dto.setCpcClasses(
                pv.getCpcClasses().stream()
                        .map(c -> c.getCpcSubclass() != null
                                ? c.getCpcSubclass() + c.getCpcGroup()
                                : c.getCpcClass())
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList()
        );

        dto.setApplicationLifecycleDto(lifecycle);

        return dto;
    }

    /* ===================== HELPERS ===================== */

    private LocalDate parseDate(JsonNode p, String field) {
        String v = p.path(field).asText(null);
        try {
            return v != null ? LocalDate.parse(v) : null;
        } catch (Exception e) {
            return null;
        }
    }

    private List<String> extractAssignees(JsonNode p) {
        return StreamSupport.stream(p.path("assignees").spliterator(), false)
                .map(a -> a.path("assignee_organization").asText(null))
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    private List<String> extractInventors(JsonNode p) {
        return StreamSupport.stream(p.path("inventors").spliterator(), false)
                .map(i -> (i.path("inventor_name_first").asText("") + " " +
                        i.path("inventor_name_last").asText("")).trim())
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }

    private PatentDetailDto tryAlternativeFormats(String originalId) {
        String digits = originalId.replaceAll("[^0-9]", "");
        for (String f : List.of(originalId, digits, "US" + digits + "A1", "US" + digits + "B2")) {
            try {
                String q = queryBuilder.buildPatentDetailQuery(f);
                JsonNode r = objectMapper.readTree(httpClient.post(q));
                JsonNode p = r.path("patents");
                if (p.isArray() && !p.isEmpty()) return parsePatentNode(p.get(0));
            } catch (Exception ignored) {}
        }
        return null;
    }
}
