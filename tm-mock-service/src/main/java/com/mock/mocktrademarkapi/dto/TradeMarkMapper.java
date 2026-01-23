package com.mock.mocktrademarkapi.dto;

import com.mock.mocktrademarkapi.model.main.GoodsAndServiceEntity;
import com.mock.mocktrademarkapi.model.main.InternationalClassEntity;
import com.mock.mocktrademarkapi.model.main.OwnerEntity;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import org.springframework.stereotype.Component;

@Component
public class TradeMarkMapper {

    public TradeMarkResponseDto toDto(TradeMarkEntity e) {
        TradeMarkResponseDto dto = new TradeMarkResponseDto();

        dto.setId(e.getId());
        dto.setMarkName(e.getMarkName());
        dto.setFilingDate(e.getFilingDate());
        dto.setStatusCode(e.getStatusCode());
        dto.setDrawingCode(e.getDrawingCode());
        dto.setStandardCharacters(e.getStandardCharacters());

        dto.setOwners(
                e.getOwners()
                        .stream()
                        .map(OwnerEntity::getOwnerName)
                        .distinct()
                        .toList()
        );

        dto.setInternationalClasses(
                e.getInternationalClasses()
                        .stream()
                        .map(InternationalClassEntity::getClassCode)
                        .distinct()
                        .toList()
        );

        dto.setGoodsAndServices(
                e.getGoodsAndServices()
                        .stream()
                        .map(GoodsAndServiceEntity::getDescription)
                        .distinct()
                        .toList()
        );

        return dto;
    }
}
