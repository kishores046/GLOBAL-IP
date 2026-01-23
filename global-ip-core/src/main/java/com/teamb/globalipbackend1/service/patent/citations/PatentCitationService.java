package com.teamb.globalipbackend1.service.patent.citations;

import com.teamb.globalipbackend1.dto.citation.CitationDTO;
import com.teamb.globalipbackend1.dto.citation.CitationNetworkDTO;
import com.teamb.globalipbackend1.external.patentsview.PatentsViewCitationClient;
import com.teamb.globalipbackend1.external.patentsview.dto.*;
import com.teamb.globalipbackend1.model.patents.PatentCitation;
import com.teamb.globalipbackend1.model.patents.CitationDirection;
import com.teamb.globalipbackend1.model.patents.CitationType;
import com.teamb.globalipbackend1.repository.citation.PatentCitationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for storing citations in database
 * Used for: detailed citation records, history tracking, database queries
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PatentCitationService {

    private final PatentsViewCitationClient citationClient;
    private final PatentCitationRepository citationRepository;

    /**
     * Fetch and store ALL citations for a patent in the database
     */
    @Transactional
    public void fetchAndStoreCitations(String patentId) {
        String normalizedPatentId = normalizeForCitation(patentId);
        log.info("Fetching all citations for patent: {}", patentId);

        AllCitationsResponse allCitations = citationClient.getAllCitations(normalizedPatentId);

        // Store backward US patent citations
        storeBackwardUSPatentCitations(patentId, allCitations.getBackwardUSPatentCitations());

        // Store forward US patent citations
        storeForwardUSPatentCitations(patentId, allCitations.getForwardUSPatentCitations());

        // Store US application citations
        storeUSApplicationCitations(patentId, allCitations.getUsApplicationCitations());

        // Store foreign citations
        storeForeignCitations(patentId, allCitations.getForeignCitations());

        log.info("Stored {} backward and {} forward citations for {}",
                allCitations.getTotalBackwardCount(),
                allCitations.getTotalForwardCount(),
                patentId);
    }

    private void storeBackwardUSPatentCitations(String patentId,
                                                List<PatentsViewUSPatentCitation> citations) {
        if (citations == null || citations.isEmpty()) return;

        for (PatentsViewUSPatentCitation c : citations) {
            // Use citationPatentId (new field name)
            if (citationRepository.existsByCitingPatentNumberAndCitedPatentNumber(
                    patentId, c.getCitationPatentId())) {
                continue; // Skip duplicates
            }

            PatentCitation citation = new PatentCitation();
            citation.setCitingPatentNumber(patentId);
            citation.setCitedPatentNumber(c.getCitationPatentId());
            citation.setCitationSequence(c.getCitationSequence());
            citation.setCitationCategory(c.getCitationCategory());
            citation.setCitedPatentDate(c.getCitationDate());
            citation.setCitationDirection(CitationDirection.BACKWARD);
            citation.setCitationType(CitationType.US_PATENT);

            citationRepository.save(citation);
        }
    }

    private void storeForwardUSPatentCitations(String patentId,
                                               List<PatentsViewUSPatentCitation> citations) {
        if (citations == null || citations.isEmpty()) return;

        for (PatentsViewUSPatentCitation c : citations) {
            if (citationRepository.existsByCitingPatentNumberAndCitedPatentNumber(
                    c.getPatentId(), patentId)) {
                continue;
            }

            PatentCitation citation = new PatentCitation();
            citation.setCitingPatentNumber(c.getPatentId()); // The other patent cites us
            citation.setCitedPatentNumber(patentId); // We are being cited
            citation.setCitationSequence(c.getCitationSequence());
            citation.setCitationCategory(c.getCitationCategory());
            citation.setCitationDirection(CitationDirection.FORWARD);
            citation.setCitationType(CitationType.US_PATENT);

            citationRepository.save(citation);
        }
    }

    private void storeUSApplicationCitations(String patentId,
                                             List<PatentsViewUSApplicationCitation> citations) {
        if (citations == null || citations.isEmpty()) return;

        for (PatentsViewUSApplicationCitation c : citations) {
            if (citationRepository.existsByCitingPatentNumberAndCitedPatentNumber(
                    patentId, c.getCitationDocumentNumber())) {
                continue;
            }

            PatentCitation citation = new PatentCitation();
            citation.setCitingPatentNumber(patentId);
            citation.setCitedPatentNumber(c.getCitationDocumentNumber());
            citation.setCitedPatentTitle(c.getCitationName());
            citation.setCitationSequence(c.getCitationSequence());
            citation.setCitationCategory(c.getCitationCategory());
            citation.setCitedPatentDate(c.getCitationDate());
            citation.setCitationDirection(CitationDirection.BACKWARD);
            citation.setCitationType(CitationType.US_APPLICATION);

            citationRepository.save(citation);
        }
    }

    private void storeForeignCitations(String patentId,
                                       List<PatentsViewForeignCitation> citations) {
        if (citations == null || citations.isEmpty()) return;

        for (PatentsViewForeignCitation c : citations) {
            String foreignPatentNumber = c.getCitationCountry() + c.getCitationNumber();

            if (citationRepository.existsByCitingPatentNumberAndCitedPatentNumber(
                    patentId, foreignPatentNumber)) {
                continue;
            }

            PatentCitation citation = new PatentCitation();
            citation.setCitingPatentNumber(patentId);
            citation.setCitedPatentNumber(foreignPatentNumber);
            citation.setCitationSequence(c.getCitationSequence());
            citation.setCitationCategory(c.getCitationCategory());
            citation.setCitedPatentDate(c.getCitationDate());
            citation.setCitationDirection(CitationDirection.BACKWARD);
            citation.setCitationType(CitationType.FOREIGN);
            citation.setCitationCountry(c.getCitationCountry());

            citationRepository.save(citation);
        }
    }

    /**
     * Get citation network from database (not for visualization, use EnhancedCitationNetworkService for that)
     */
    @Transactional(readOnly = true)
    public CitationNetworkDTO getCitationNetwork(String patentNumber) {

        // Backward: this patent → others
        List<PatentCitation> backwardEntities =
                citationRepository.findByCitingPatentNumberAndCitationDirection(
                        patentNumber, CitationDirection.BACKWARD
                );

        // Forward: others → this patent
        List<PatentCitation> forwardEntities =
                citationRepository.findByCitedPatentNumberAndCitationDirection(
                        patentNumber, CitationDirection.FORWARD
                );

        List<CitationDTO> backward = backwardEntities.stream()
                .map(this::toCitationDTO)
                .toList();

        List<CitationDTO> forward = forwardEntities.stream()
                .map(this::toCitationDTO)
                .toList();

        CitationNetworkDTO network = new CitationNetworkDTO();
        network.setCenterPatentId(patentNumber);
        network.setBackwardCitations(backward);
        network.setForwardCitations(forward);
        network.setBackwardCount(backward.size());
        network.setForwardCount(forward.size());

        return network;
    }

    private CitationDTO toCitationDTO(PatentCitation entity) {
        CitationDTO dto = new CitationDTO();
        dto.setCitingPatent(entity.getCitingPatentNumber());
        dto.setCitedPatent(entity.getCitedPatentNumber());
        dto.setCitationType(entity.getCitationType().name());
        dto.setCitationDirection(entity.getCitationDirection().name());
        dto.setCitationCategory(entity.getCitationCategory());
        dto.setCountry(entity.getCitationCountry());
        dto.setCitedPatentDate(entity.getCitedPatentDate());

        return dto;
    }

    private String normalizeForCitation(String patentId) {
        if (patentId == null) return null;

        String id = patentId.trim().toUpperCase();

        // Remove kind code
        id = id.replaceAll("(A\\d|B\\d)$", "");

        // Add US prefix if missing
        if (!id.startsWith("US")) {
            id = "US" + id;
        }

        return id;
    }
}