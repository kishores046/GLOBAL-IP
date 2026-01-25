package com.teamb.globalipbackend1.service.patent.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/**
 * Service responsible for filtering patent documents based on search criteria
 * Separated from I/O operations for better testability and maintainability
 */
@Slf4j
@Service
public class PatentFilterService {

    public List<PatentDocument> applyFilters(
            List<PatentDocument> patents,
            PatentSearchFilter filter) {

        log.info("Applying filters to {} patents", patents.size());
        log.debug("Filter criteria: {}", filter);

        List<PatentDocument> filtered = patents.stream()
               // .filter(p -> matchesJurisdiction(p, filter))
                .filter(p -> matchesDateRange(p, filter))
                .filter(p -> matchesAssignee(p, filter))
                .filter(p -> matchesInventor(p, filter))
                .toList();

        log.info("After filtering: {} patents remain (from {} providers)",
                filtered.size(), patents.size());

        return filtered;
    }

    private boolean matchesJurisdiction(PatentDocument patent, PatentSearchFilter filter) {
        // If no jurisdiction filter or "ALL", include everything
        if (filter.getJurisdiction() == null ||
                filter.getJurisdiction().isBlank() ||
                filter.getJurisdiction().equalsIgnoreCase("ALL")) {
            return true;
        }

        // If patent has no jurisdiction, exclude it
        if (patent.getJurisdiction() == null || patent.getJurisdiction().isBlank()) {
            log.debug("Patent {} has no jurisdiction, excluding", patent.getPublicationNumber());
            return false;
        }

        // Case-insensitive comparison, trimmed
        String filterJurisdiction = filter.getJurisdiction().trim().toUpperCase();
        String patentJurisdiction = patent.getJurisdiction().trim().toUpperCase();

        boolean matches = filterJurisdiction.equals(patentJurisdiction);

        if (!matches) {
            log.debug("Patent {} jurisdiction '{}' doesn't match filter '{}'",
                    patent.getPublicationNumber(),
                    patent.getJurisdiction(),
                    filter.getJurisdiction());
        }

        return matches;
    }

    private boolean matchesDateRange(PatentDocument patent, PatentSearchFilter filter) {
        // If no date filter, include everything
        if (filter.getFilingDateFrom() == null && filter.getFilingDateTo() == null) {
            return true;
        }

        // Get patent's filing date
        LocalDate patentDate = patent.getFilingDate();

        // If patent has no date, be lenient and include it
        if (patentDate == null) {
            log.debug("Patent {} has no filing date, including it",
                    patent.getPublicationNumber());
            return true;
        }

        // Check "from" date
        if (filter.getFilingDateFrom() != null &&
                patentDate.isBefore(filter.getFilingDateFrom())) {
            log.debug("Patent {} date {} is before filter from date {}",
                    patent.getPublicationNumber(),
                    patentDate,
                    filter.getFilingDateFrom());
            return false;
        }

        // Check "to" date
        if (filter.getFilingDateTo() != null &&
                patentDate.isAfter(filter.getFilingDateTo())) {
            log.debug("Patent {} date {} is after filter to date {}",
                    patent.getPublicationNumber(),
                    patentDate,
                    filter.getFilingDateTo());
            return false;
        }

        return true;
    }

    boolean matchesAssignee(PatentDocument patent, PatentSearchFilter filter) {
        // If no assignee filter, include everything
        if (filter.getAssignee() == null || filter.getAssignee().isBlank()) {
            return true;
        }

        // If patent has no assignees, exclude it
        if (patent.getAssignees() == null || patent.getAssignees().isEmpty()) {
            log.debug("Patent {} has no assignees, excluding", patent.getPublicationNumber());
            return false;
        }

        String searchTerm = filter.getAssignee().toLowerCase().trim();

        boolean matches = patent.getAssignees().stream()
                .filter(Objects::nonNull)
                .map(assignee -> assignee.toLowerCase().trim())
                .anyMatch(assignee -> assignee.contains(searchTerm));

        if (!matches) {
            log.debug("Patent {} assignees {} don't match filter '{}'",
                    patent.getPublicationNumber(),
                    patent.getAssignees(),
                    filter.getAssignee());
        }

        return matches;
    }

    boolean matchesInventor(PatentDocument patent, PatentSearchFilter filter) {
        // If no inventor filter, include everything
        if (filter.getInventor() == null || filter.getInventor().isBlank()) {
            return true;
        }

        // If patent has no inventors, exclude it
        if (patent.getInventors() == null || patent.getInventors().isEmpty()) {
            log.debug("Patent {} has no inventors, excluding", patent.getPublicationNumber());
            return false;
        }

        String searchTerm = filter.getInventor().toLowerCase().trim();

        boolean matches = patent.getInventors().stream()
                .filter(Objects::nonNull)
                .map(inventor -> inventor.toLowerCase().trim())
                .anyMatch(inventor -> inventor.contains(searchTerm));

        if (!matches) {
            log.debug("Patent {} inventors {} don't match filter '{}'",
                    patent.getPublicationNumber(),
                    patent.getInventors(),
                    filter.getInventor());
        }

        return matches;
    }
}