package com.teamb.globalipbackend1.service.search;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewHttpClient;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentDetailDto;
import com.teamb.globalipbackend1.external.patentsview.dto.PatentsViewCpcCurrent;
import com.teamb.globalipbackend1.external.patentsview.querybuilder.PatentsViewQueryBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatentsViewDetailsService {

    private final PatentsViewHttpClient httpClient;
    private final PatentsViewQueryBuilder queryBuilder;
    private final ObjectMapper objectMapper;

    /* ===================== MAIN FETCH ===================== */

    public PatentDetailDto fetchPatentDetail(String publicationNumber) {

        log.info("=== PATENTSVIEW DETAIL FETCH ===");
        log.info("Input publicationNumber: {}", publicationNumber);

        try {
            // ⚠️ DO NOT normalize here – QueryBuilder owns normalization
            String query = queryBuilder.buildPatentDetailQuery(publicationNumber);
            log.debug("PatentsView query: {}", query);

            String response = httpClient.post(query);
            JsonNode root = objectMapper.readTree(response);

            if (root.has("error")) {
                log.error("PatentsView API error: {}", root.get("error"));
                return null;
            }

            JsonNode patents = root.path("patents");
            if (!patents.isArray() || patents.isEmpty()) {
                log.warn("No patents returned for {}", publicationNumber);
                return tryAlternativeFormats(publicationNumber);
            }

            return parsePatentNode(patents.get(0));

        } catch (Exception e) {
            log.error("Failed to fetch PatentsView detail for {}", publicationNumber, e);
            return null;
        }
    }

    /* ===================== PARSER ===================== */

    private PatentDetailDto parsePatentNode(JsonNode p) {

        PatentDetailDto dto = new PatentDetailDto();

        dto.setPatentId(p.path("patent_id").asText(null));
        dto.setTitle(p.path("patent_title").asText(null));
        dto.setAbstractText(p.path("patent_abstract").asText(null));

        // Grant date
        parseDate(p, "patent_date", dto::setGrantDate);

        // 🔥 Filing date (THIS WAS MISSING)
        parseDate(p, "patent_earliest_application_date", dto::setFillingDate);

        dto.setWipoKind(p.path("wipo_kind").asText(null));

        // Analytics
        dto.setTimesCited(
                p.has("patent_num_times_cited_by_us_patents")
                        ? p.path("patent_num_times_cited_by_us_patents").asInt()
                        : null
        );

        dto.setTotalCitations(
                p.has("patent_num_total_documents_cited")
                        ? p.path("patent_num_total_documents_cited").asInt()
                        : null
        );

        dto.setAssignees(extractAssignees(p));
        dto.setInventors(extractInventors(p));

        JsonNode cpcNode = p.path("cpc_current");
        if (cpcNode.isArray()) {
            dto.setCpcClasses(
                    objectMapper.convertValue(
                            cpcNode,
                            new TypeReference<List<PatentsViewCpcCurrent>>() {}
                    )
            );
        } else {
            dto.setCpcClasses(List.of());
        }

        log.info("Parsed PatentsView detail: {}", dto.getPatentId());
        return dto;
    }

    /* ===================== FALLBACK ===================== */

    private PatentDetailDto tryAlternativeFormats(String originalId) {

        log.info("Trying alternative formats for {}", originalId);

        String digits = originalId.replaceAll("[^0-9]", "");

        String[] formats = {
                originalId,
                digits,
                "US" + digits + "B2",
                "US" + digits + "A1"
        };

        for (String f : formats) {
            try {
                String query = queryBuilder.buildPatentDetailQuery(f);
                JsonNode root = objectMapper.readTree(httpClient.post(query));
                JsonNode patents = root.path("patents");

                if (patents.isArray() && !patents.isEmpty()) {
                    log.info("SUCCESS with format {}", f);
                    return parsePatentNode(patents.get(0));
                }
            } catch (Exception e) {
                log.debug("Format {} failed", f);
            }
        }

        log.error("All PatentsView formats failed for {}", originalId);
        return null;
    }

    /* ===================== GLOBAL DTO ===================== */

    public GlobalPatentDetailDto fetchGlobalDetail(String publicationNumber) {

        PatentDetailDto pv = fetchPatentDetail(publicationNumber);
        if (pv == null) return null;

        GlobalPatentDetailDto dto = new GlobalPatentDetailDto();
        dto.setPublicationNumber(pv.getPatentId());
        dto.setJurisdiction("US");
        dto.setTitle(pv.getTitle());
        dto.setAbstractText(pv.getAbstractText());
        dto.setFilingDate(pv.getFillingDate());
        dto.setGrantDate(pv.getGrantDate());
        dto.setWipoKind(pv.getWipoKind());
        dto.setAssignees(pv.getAssignees());
        dto.setInventors(pv.getInventors());
        dto.setTimesCited(pv.getTimesCited());
        dto.setTotalCitations(pv.getTotalCitations());

        if (pv.getCpcClasses() != null) {
            dto.setCpcClasses(
                    pv.getCpcClasses().stream()
                            .map(cpc -> {
                                if (cpc.getCpcSubclass() != null && cpc.getCpcGroup() != null) {
                                    return cpc.getCpcSubclass() + cpc.getCpcGroup();
                                }
                                return cpc.getCpcClass();
                            })
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList()
            );
        } else {
            dto.setCpcClasses(List.of());
        }

        return dto;
    }

    /* ===================== HELPERS ===================== */

    private void parseDate(JsonNode p, String field, java.util.function.Consumer<LocalDate> setter) {
        String v = p.path(field).asText(null);
        if (v != null && !v.isBlank()) {
            try {
                setter.accept(LocalDate.parse(v));
            } catch (Exception e) {
                log.warn("Failed to parse {} = {}", field, v);
            }
        }
    }

    private List<String> extractAssignees(JsonNode p) {
        return StreamSupport.stream(p.path("assignees").spliterator(), false)
                .map(a -> a.path("assignee_organization").asText(null))
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }

    private List<String> extractInventors(JsonNode p) {
        return StreamSupport.stream(p.path("inventors").spliterator(), false)
                .map(i -> (i.path("inventor_name_first").asText("") +
                        " " +
                        i.path("inventor_name_last").asText("")).trim())
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }
}
