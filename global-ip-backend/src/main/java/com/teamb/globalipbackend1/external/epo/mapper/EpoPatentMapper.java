package com.teamb.globalipbackend1.external.epo.mapper;

import com.teamb.globalipbackend1.external.epo.dto.*;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Component
public class EpoPatentMapper {

    public PatentDocument map(EpoExchangeDocument doc) {
        if (doc == null) return null;

        PatentDocument patent = new PatentDocument();

        patent.setPublicationNumber(buildPublicationNumber(doc));
        patent.setJurisdiction(doc.getCountry());
        patent.setTitle(extractEnglishTitle(doc));
        patent.setPublicationDate(extractPublicationDate(doc));
        patent.setAssignees(extractAssignees(doc));
        patent.setInventors(extractInventors(doc));

        log.info(
                "Mapped patent {} → assignees={}, inventors={}",
                patent.getPublicationNumber(),
                patent.getAssignees().size(),
                patent.getInventors().size()
        );

        return patent;
    }

    /* ---------------- helpers ---------------- */

    private String buildPublicationNumber(EpoExchangeDocument doc) {
        if (doc.getCountry() == null || doc.getDocNumber() == null) return null;
        return doc.getCountry() + doc.getDocNumber();
    }

    private String extractEnglishTitle(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null) return null;

        List<EpoTitle> titles =
                doc.getBibliographicData().getInventionTitles();

        if (titles == null || titles.isEmpty()) return null;

        return titles.stream()
                .filter(t -> t != null && t.getValue() != null)
                .filter(t -> "en".equalsIgnoreCase(t.getLang()))
                .map(EpoTitle::getValue)
                .findFirst()
                .orElse(
                        titles.stream()
                                .filter(t -> t != null && t.getValue() != null)
                                .map(EpoTitle::getValue)
                                .findFirst()
                                .orElse(null)
                );
    }

    private LocalDate extractPublicationDate(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getPublicationReference() == null ||
                doc.getBibliographicData().getPublicationReference().getDocumentId() == null) {
            return null;
        }

        String rawDate =
                doc.getBibliographicData()
                        .getPublicationReference()
                        .getDocumentId()
                        .getDate();

        if (rawDate == null || rawDate.isBlank()) return null;

        try {
            return LocalDate.parse(rawDate, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception e) {
            log.warn("Failed to parse publication date: {}", rawDate);
            return null;
        }
    }

    /* ================== FIXED PART ================== */

    private List<String> extractAssignees(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getParties() == null ||
                doc.getBibliographicData().getParties().getApplicants() == null ||
                doc.getBibliographicData().getParties().getApplicants().getList() == null) {

            log.debug("No applicants found in OPS XML");
            return List.of();
        }

        return doc.getBibliographicData()
                .getParties()
                .getApplicants()
                .getList()
                .stream()
                .map(EpoApplicant::getName)
                .map(EpoName::getValue)
                .filter(v -> v != null && !v.isBlank())
                .distinct()
                .toList();
    }

    private List<String> extractInventors(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null ||
                doc.getBibliographicData().getParties() == null ||
                doc.getBibliographicData().getParties().getInventors() == null ||
                doc.getBibliographicData().getParties().getInventors().getList() == null) {

            log.debug("No inventors found in OPS XML");
            return List.of();
        }

        return doc.getBibliographicData()
                .getParties()
                .getInventors()
                .getList()
                .stream()
                .map(EpoInventor::getName)
                .map(EpoName::getValue)
                .filter(v -> v != null && !v.isBlank())
                .distinct()
                .toList();
    }
}
