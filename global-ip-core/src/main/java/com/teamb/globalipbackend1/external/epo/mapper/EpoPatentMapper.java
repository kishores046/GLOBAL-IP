package com.teamb.globalipbackend1.external.epo.mapper;

import com.teamb.globalipbackend1.external.epo.dto.*;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
public class EpoPatentMapper {

    private static final DateTimeFormatter BASIC_DATE =
            DateTimeFormatter.BASIC_ISO_DATE;

    public PatentDocument map(EpoExchangeDocument doc,EpoDocumentId id) {
        if (doc == null) return null;

        PatentDocument patent = new PatentDocument();

        patent.setPublicationNumber(buildPublicationNumber(doc));
        patent.setJurisdiction(id.getCountry());
        patent.setTitle(extractEnglishTitle(doc));
        patent.setFilingDate(extractPublicationDate(doc));
        patent.setGrantDate(extractFilingDate(doc));
        patent.setAssignees(extractAssignees(doc));
        patent.setInventors(extractInventors(doc));

        return patent;
    }



    private String buildPublicationNumber(EpoExchangeDocument doc) {
        if (doc.getCountry() == null || doc.getDocNumber() == null) return null;
        return doc.getCountry() + doc.getDocNumber();
    }

    private String extractEnglishTitle(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null) return null;

        List<EpoTitle> titles =
                doc.getBibliographicData().getInventionTitles();

        if (titles == null || titles.isEmpty()) return null;

        String fallback = null;

        for (EpoTitle t : titles) {
            if (t == null || t.getValue() == null) continue;

            if ("en".equalsIgnoreCase(t.getLang())) {
                return t.getValue();
            }

            if (fallback == null) {
                fallback = t.getValue();
            }
        }
        return fallback;
    }

    private LocalDate extractPublicationDate(EpoExchangeDocument doc) {
        String raw = safeGetPublicationDate(doc);
        return parseDate(raw, "publication");
    }

    private LocalDate extractFilingDate(EpoExchangeDocument doc) {
        String raw = safeGetFilingDate(doc);
        return parseDate(raw, "filing");
    }

    private LocalDate parseDate(String raw, String type) {
        if (raw == null || raw.isBlank()) return null;

        try {
            return LocalDate.parse(raw, BASIC_DATE);
        } catch (Exception e) {
            log.warn("Failed to parse {} date: {}", type, raw);
            return null;
        }
    }

    /* ================= names ================= */

    private List<String> extractAssignees(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getParties() == null ||
                doc.getBibliographicData().getParties().getApplicants() == null ||
                doc.getBibliographicData().getParties().getApplicants().getList() == null) {

            return List.of();
        }

        return normalizeNames(
                doc.getBibliographicData()
                        .getParties()
                        .getApplicants()
                        .getList(),
                true
        );
    }

    private List<String> extractInventors(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getParties() == null ||
                doc.getBibliographicData().getParties().getInventors() == null ||
                doc.getBibliographicData().getParties().getInventors().getList() == null) {

            return List.of();
        }

        return normalizeNames(
                doc.getBibliographicData()
                        .getParties()
                        .getInventors()
                        .getList(),
                false
        );
    }

    private <T> List<String> normalizeNames(List<T> people, boolean applicant) {
        Set<String> result = new LinkedHashSet<>();

        for (T p : people) {
            EpoName name =
                    applicant
                            ? ((EpoApplicant) p).getName()
                            : ((EpoInventor) p).getName();

            if (name == null || name.getValue() == null) continue;

            String v = name.getValue().trim();
            if (v.isEmpty()) continue;

            // Remove trailing comma (NO regex)
            if (v.charAt(v.length() - 1) == ',') {
                v = v.substring(0, v.length() - 1);
            }

            result.add(v);
        }

        return result.isEmpty()
                ? List.of()
                : new ArrayList<>(result);
    }



    private String safeGetPublicationDate(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getPublicationReference() == null ||
                doc.getBibliographicData().getPublicationReference().getDocumentId() == null) {
            return null;
        }
        return doc.getBibliographicData()
                .getPublicationReference()
                .getDocumentId()
                .getDate();
    }

    private String safeGetFilingDate(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getApplicationReference() == null ||
                doc.getBibliographicData().getApplicationReference().getDocumentId() == null) {
            return null;
        }
        return doc.getBibliographicData()
                .getApplicationReference()
                .getDocumentId()
                .getDate();
    }
}
