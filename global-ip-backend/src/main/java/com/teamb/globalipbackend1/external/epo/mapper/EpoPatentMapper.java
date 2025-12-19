package com.teamb.globalipbackend1.external.epo.mapper;

import com.teamb.globalipbackend1.external.epo.dto.*;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.util.List;

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

        return patent;
    }

    /* ---------------- helper methods ---------------- */

    private String buildPublicationNumber(EpoExchangeDocument doc) {
        if (doc.getCountry() == null || doc.getDocNumber() == null) {
            return null;
        }
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
                .orElseGet(() ->
                        titles.stream()
                                .filter(t -> t != null && t.getValue() != null)
                                .map(EpoTitle::getValue)
                                .findFirst()
                                .orElse(null)
                );
    }

    private LocalDate extractPublicationDate(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null) return null;
        if (doc.getBibliographicData().getPublicationReference() == null) return null;
        if (doc.getBibliographicData().getPublicationReference().getDocumentId() == null)
            return null;

        String rawDate =
                doc.getBibliographicData()
                        .getPublicationReference()
                        .getDocumentId()
                        .getDate();

        if (rawDate == null || rawDate.isBlank()) return null;

        try {
            return LocalDate.parse(rawDate, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (Exception e) {
            return null; // OPS date formats are not sacred
        }
    }

    private List<String> extractAssignees(EpoExchangeDocument doc) {

        if (doc.getBibliographicData() == null) return List.of();
        if (doc.getBibliographicData().getParties() == null) return List.of();

        List<EpoApplicant> applicants =
                doc.getBibliographicData()
                        .getParties()
                        .getApplicants();

        if (applicants == null || applicants.isEmpty()) return List.of();

        return applicants.stream()
                .filter(a -> a != null && a.getName() != null)
                .map(a -> a.getName().getValue())
                .filter(v -> v != null && !v.isBlank())
                .distinct()
                .toList();
    }


    private List<String> extractInventors(EpoExchangeDocument doc) {
        if (doc.getBibliographicData() == null) return List.of();
        if (doc.getBibliographicData().getParties() == null) return List.of();

        List<EpoInventor> inventors =
                doc.getBibliographicData().getParties().getInventors();

        if (inventors == null || inventors.isEmpty()) return List.of();

        return inventors.stream()
                .filter(i -> i != null && i.getName() != null)
                .map(i -> i.getName().getValue())
                .filter(v -> v != null && !v.isBlank())
                .toList();
    }
}
