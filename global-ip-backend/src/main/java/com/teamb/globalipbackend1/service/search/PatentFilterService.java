package com.teamb.globalipbackend1.service.search;

import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/**
 * Service responsible for filtering patent documents based on searchByKeyword criteria
 * Separated from I/O operations for better testability and maintainability
 */
@Slf4j
@Service
public class PatentFilterService {

    public List<PatentDocument> applyFilters(
            List<PatentDocument> patents,
            PatentSearchFilter filter) {

        log.info("Applying filters to {} patents", patents.size());

        List<PatentDocument> filtered = patents.stream()
                .filter(p -> matchesJurisdiction(p, filter))
                .filter(p -> matchesDateRange(p, filter))
                .filter(p -> matchesAssignee(p, filter))
                .filter(p -> matchesInventor(p, filter))
                .toList();

        log.info("After filtering: {} patents remain", filtered.size());

        return filtered;
    }

    private boolean matchesJurisdiction(PatentDocument patent, PatentSearchFilter filter) {
        if (filter.getJurisdiction() == null ||
                filter.getJurisdiction().equalsIgnoreCase("ALL")) {
            return true;
        }

        if (patent.getJurisdiction() == null) {
            log.debug("Patent {} has no jurisdiction, excluding", patent.getPublicationNumber());
            return false;
        }

        boolean matches = filter.getJurisdiction().equalsIgnoreCase(patent.getJurisdiction());

        if (!matches) {
            log.debug("Patent {} jurisdiction {} doesn't match filter {}",
                    patent.getPublicationNumber(),
                    patent.getJurisdiction(),
                    filter.getJurisdiction());
        }

        return matches;
    }

    private boolean matchesDateRange(PatentDocument patent, PatentSearchFilter filter) {

        if (filter.getFilingDateFrom() == null && filter.getFilingDateTo() == null) {
            return true;
        }


        LocalDate patentDate = patent.getFilingDate();


        if (patentDate == null) {
            log.debug("Patent {} has no publication date, including it",
                    patent.getPublicationNumber());
            return true;
        }

        if (filter.getFilingDateFrom() != null &&
                patentDate.isBefore(filter.getFilingDateFrom())) {
            log.debug("Patent {} date {} is before filter from date {}",
                    patent.getPublicationNumber(),
                    patentDate,
                    filter.getFilingDateFrom());
            return false;
        }


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

        if (filter.getAssignee() == null || filter.getAssignee().isBlank()) {
            return true;
        }


        if (patent.getAssignees() == null || patent.getAssignees().isEmpty()) {
            log.debug("Patent {} has no assignees, excluding", patent.getPublicationNumber());
            return false;
        }

        String searchTerm = filter.getAssignee().toLowerCase().trim();

        boolean matches = patent.getAssignees().stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
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

        if (filter.getInventor() == null || filter.getInventor().isBlank()) {
            return true;
        }

        if (patent.getInventors() == null || patent.getInventors().isEmpty()) {
            log.debug("Patent {} has no inventors, excluding", patent.getPublicationNumber());
            return false;
        }

        String searchTerm = filter.getInventor().toLowerCase().trim();

        boolean matches = patent.getInventors().stream()
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
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