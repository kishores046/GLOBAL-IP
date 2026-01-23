
package com.mock.mocktrademarkapi.mapper;
import com.mock.mocktrademarkapi.model.dto.CaseFile;
import com.mock.mocktrademarkapi.model.dto.CaseFileHeader;
import com.mock.mocktrademarkapi.model.dto.CaseFileStatement;
import com.mock.mocktrademarkapi.model.main.GoodsAndServiceEntity;
import com.mock.mocktrademarkapi.model.main.InternationalClassEntity;
import com.mock.mocktrademarkapi.model.main.OwnerEntity;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TrademarkMapper {

    public TradeMarkEntity map(CaseFile caseFile) {
        TradeMarkEntity trademark = new TradeMarkEntity();

        try {
            trademark.setId(caseFile.getSerialNumber());
            trademark.setMarkName(extractMarkName(caseFile));
            trademark.setDrawingCode(extractDrawingCode(caseFile));
            trademark.setStatusCode(extractStatusCode(caseFile));
            trademark.setFilingDate(extractFilingDate(caseFile));
            trademark.setStandardCharacters(extractStandardCharacters(caseFile));

            trademark.setOwners(extractOwners(caseFile));
            trademark.setInternationalClasses(mapInternationalClasses(caseFile, trademark));
            trademark.setGoodsAndServices(mapGoodsAndServices(caseFile, trademark));

        } catch (Exception e) {
            log.error(
                    "Failed to map CaseFile to TradeMarkEntity, serialNumber={}",
                    caseFile != null ? caseFile.getSerialNumber() : "UNKNOWN",
                    e
            );
        }

        return trademark;
    }

    /* ---------------- HEADER ---------------- */

    private String extractMarkName(CaseFile caseFile) {
        return Optional.ofNullable(caseFile.getCaseFileHeader())
                .map(CaseFileHeader::getMarkName)
                .orElse(null);
    }

    private String extractStatusCode(CaseFile caseFile) {
        return Optional.ofNullable(caseFile.getCaseFileHeader())
                .map(CaseFileHeader::getStatusCode)
                .orElse(null);
    }

    private String extractDrawingCode(CaseFile caseFile) {
        return Optional.ofNullable(caseFile.getCaseFileHeader())
                .map(CaseFileHeader::getDrawingCode)
                .orElse(null);
    }

    private Boolean extractStandardCharacters(CaseFile caseFile) {
        return Optional.ofNullable(caseFile.getCaseFileHeader())
                .map(CaseFileHeader::getStandardCharactersRaw)
                .map(v -> !"F".equalsIgnoreCase(v))
                .orElse(false);
    }

    private LocalDate extractFilingDate(CaseFile caseFile) {
        return Optional.ofNullable(caseFile.getCaseFileHeader())
                .map(CaseFileHeader::getFilingDate)
                .flatMap(this::safeParseDate)
                .orElse(null);
    }

    private Optional<LocalDate> safeParseDate(String s) {
        if (s == null || s.length() != 8) return Optional.empty();
        try {
            return Optional.of(LocalDate.of(
                    Integer.parseInt(s.substring(0, 4)),
                    Integer.parseInt(s.substring(4, 6)),
                    Integer.parseInt(s.substring(6, 8))
            ));
        } catch (Exception e) {
            log.warn("Invalid filing-date: {}", s);
            return Optional.empty();
        }
    }


    private Set<OwnerEntity> extractOwners(CaseFile caseFile) {
        if (caseFile.getCaseFileOwners() == null) return Set.of();

        return caseFile.getCaseFileOwners()
                .getCaseFileOwnerList()
                .stream()
                .map(ownerDto -> {
                    OwnerEntity owner = new OwnerEntity();
                    owner.setOwnerName(ownerDto.getPartyName());
                    owner.setOwnerState(ownerDto.getState());
                    owner.setOwnerCountry(
                            ownerDto.getNationality() != null
                                    ? ownerDto.getNationality().getCountry()
                                    : null
                    );
                    return owner;
                })
                .collect(Collectors.toSet());
    }


    private Set<InternationalClassEntity> mapInternationalClasses(
            CaseFile caseFile,
            TradeMarkEntity trademark
    ) {
        if (caseFile.getClassifications() == null) return Set.of();

        return caseFile.getClassifications()
                .getClassifications()
                .stream()
                .map(c -> {
                    InternationalClassEntity entity = new InternationalClassEntity();
                    entity.setClassCode(c.getInternationalCode());
                    entity.setTradeMarkEntity(trademark);
                    return entity;
                })
                .collect(Collectors.toSet());
    }

    /* ---------------- GOODS & SERVICES ---------------- */

    private static final Set<String> STOP_WORDS = Set.of(
            "and", "or", "the", "for", "with", "in", "of", "to", "by", "on"
    );

    private Set<GoodsAndServiceEntity> mapGoodsAndServices(
            CaseFile caseFile,
            TradeMarkEntity trademark
    ) {
        if (caseFile.getCaseFileStatements() == null) return Set.of();

        return caseFile.getCaseFileStatements()
                .getCaseFileSystems()
                .stream()
                .filter(this::isGoodsAndServicesStatement)
                .map(CaseFileStatement::getText)
                .filter(this::hasText)
                .map(text -> {
                    GoodsAndServiceEntity gs = new GoodsAndServiceEntity();
                    gs.setDescription(text);
                    gs.setTradeMarkEntity(trademark);
                    return gs;
                })
                .collect(Collectors.toSet());
    }

    private boolean isGoodsAndServicesStatement(CaseFileStatement stmt) {
        return stmt != null
                && stmt.getTypeCode() != null
                && stmt.getTypeCode().startsWith("GS");
    }

    private boolean hasText(String text) {
        return text != null && !text.isBlank();
    }
}
