package com.teamb.globalipbackend1.service.patent.competitor;

import com.teamb.globalipbackend1.dto.competitor.CompetitorCreateRequest;
import com.teamb.globalipbackend1.dto.competitor.CompetitorDTO;
import com.teamb.globalipbackend1.dto.competitor.CompetitorUpdateRequest;
import com.teamb.globalipbackend1.model.patents.Competitor;
import com.teamb.globalipbackend1.repository.competitor.CompetitorFilingRepository;
import com.teamb.globalipbackend1.repository.competitor.CompetitorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompetitorService {

    private final CompetitorRepository competitorRepository;
    private final CompetitorFilingRepository filingRepository;

    /**
     * Create a new competitor
     */
    @Transactional
    public CompetitorDTO createCompetitor(CompetitorCreateRequest request) {

        if (competitorRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException(
                    "Competitor code already exists: " + request.getCode()
            );
        }

        String jurisdiction =
                request.getJurisdiction() != null
                        ? request.getJurisdiction().toUpperCase()
                        : "US"; // default for safety

        validateJurisdiction(jurisdiction);

        Competitor competitor = Competitor.builder()
                .code(request.getCode().toUpperCase())
                .displayName(request.getDisplayName())
                .assigneeNames(request.getAssigneeNames())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .jurisdiction(jurisdiction)
                .active(true)
                .build();

        competitor = competitorRepository.save(competitor);

        log.info(
                "Created competitor {} [{}]",
                competitor.getCode(),
                competitor.getJurisdiction()
        );

        return toDTO(competitor);
    }


    /**
     * Update existing competitor
     */
    @Transactional
    public CompetitorDTO updateCompetitor(Long id, CompetitorUpdateRequest request) {

        Competitor competitor = competitorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Competitor not found: " + id
                ));

        if (request.getDisplayName() != null) {
            competitor.setDisplayName(request.getDisplayName());
        }
        if (request.getAssigneeNames() != null) {
            competitor.setAssigneeNames(request.getAssigneeNames());
        }
        if (request.getActive() != null) {
            competitor.setActive(request.getActive());
        }
        if (request.getDescription() != null) {
            competitor.setDescription(request.getDescription());
        }
        if (request.getIndustry() != null) {
            competitor.setIndustry(request.getIndustry());
        }
        if (request.getJurisdiction() != null) {
            String jurisdiction = request.getJurisdiction().toUpperCase();
            validateJurisdiction(jurisdiction);
            competitor.setJurisdiction(jurisdiction);
        }

        competitor = competitorRepository.save(competitor);
        return toDTO(competitor);
    }


    /**
     * Get competitor by ID
     */
    @Transactional(readOnly = true)
    public CompetitorDTO getCompetitor(Long id) {
        Competitor competitor = competitorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Competitor not found: " + id));
        return toDTO(competitor);
    }

    /**
     * Get competitor by code
     */
    @Transactional(readOnly = true)
    public CompetitorDTO getCompetitorByCode(String code) {
        Competitor competitor = competitorRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Competitor not found: " + code));
        return toDTO(competitor);
    }

    /**
     * List all competitors
     */
    @Transactional(readOnly = true)
    public List<CompetitorDTO> listAllCompetitors() {
        return competitorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * List active competitors only
     */
    @Transactional(readOnly = true)
    public List<CompetitorDTO> listActiveCompetitors() {
        return competitorRepository.findAllActiveOrderByName().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search competitors
     */
    @Transactional(readOnly = true)
    public List<CompetitorDTO> searchCompetitors(String searchTerm) {
        return competitorRepository.searchCompetitors(searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Delete competitor (soft delete by setting active = false)
     */
    @Transactional
    public void deleteCompetitor(Long id) {
        Competitor competitor = competitorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Competitor not found: " + id));

        competitor.setActive(false);
        competitorRepository.save(competitor);

        log.info("Deactivated competitor: {}", competitor.getCode());
    }

    /**
     * Get all active competitors for filing sync
     */
    @Transactional(readOnly = true)
    public List<Competitor> getActiveCompetitorsForSync() {
        return competitorRepository.findByActiveTrue();
    }

    /**
     * Convert entity to DTO
     */
    private CompetitorDTO toDTO(Competitor competitor) {
        return CompetitorDTO.builder()
                .id(competitor.getId())
                .code(competitor.getCode())
                .displayName(competitor.getDisplayName())
                .assigneeNames(competitor.getAssigneeNames())
                .active(competitor.getActive())
                .description(competitor.getDescription())
                .industry(competitor.getIndustry())
                .jurisdiction(competitor.getJurisdiction())
                .createdAt(competitor.getCreatedAt())
                .updatedAt(competitor.getUpdatedAt())
                .build();
    }


    /**
     * Convert entity to DTO with filing count
     */
    private CompetitorDTO toDTOWithFilingCount(Competitor competitor, Long filingCount) {
        CompetitorDTO dto = toDTO(competitor);
        dto.setTotalFilings(filingCount);
        return dto;
    }
    private void validateJurisdiction(String jurisdiction) {
        if (!List.of("US", "EP", "BOTH").contains(jurisdiction)) {
            throw new IllegalArgumentException(
                    "Invalid jurisdiction. Allowed: US, EP, BOTH"
            );
        }
    }

    @Transactional(readOnly = true)
    public long getTotalCompetitorTrackingCount() {
        return filingRepository.getTotalTrackedCompetitors();
    }

}
