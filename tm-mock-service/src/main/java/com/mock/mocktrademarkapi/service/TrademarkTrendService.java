package com.mock.mocktrademarkapi.service;

import com.mock.mocktrademarkapi.domain.TrademarkStatus;
import com.mock.mocktrademarkapi.dto.trend.*;
import com.mock.mocktrademarkapi.repository.TrademarkTrendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrademarkTrendService {

    private final TrademarkTrendRepository repository;

    /* ===================== CORE METRICS ===================== */

    public long totalApplications() {
        // reuse year aggregation
        return repository.totalByYear()
                .stream()
                .mapToLong(r -> ((Number) r[1]).longValue())
                .sum();
    }

    public List<YearCountDto> filingsByYear() {
        return repository.totalByYear()
                .stream()
                .filter(r -> r[0] != null)
                .map(r -> new YearCountDto(
                        ((Number) r[0]).intValue(),
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }


    /* ===================== STATUS ===================== */

    public List<SimpleCountDto> statusDistribution() {
        return repository.statusDistribution()
                .stream()
                .map(r -> (Object[]) r)
                .map(r -> {
                    String code = String.valueOf(r[0]);
                    TrademarkStatus status = TrademarkStatus.fromCode(code);

                    return new SimpleCountDto(
                            status.description(),
                            ((Number) r[1]).longValue()
                    );
                })
                .toList();
    }

    /* ===================== CLASSIFICATION ===================== */

    public List<CodeDistributionDto> topInternationalClasses() {

        long total = repository.topClasses()
                .stream()
                .mapToLong(r -> ((Number) r[1]).longValue())
                .sum();

        return repository.topClasses()
                .stream()
                .map(r -> new CodeDistributionDto(
                        (String) r[0],
                        ((Number) r[1]).longValue(),
                        total == 0 ? 0.0 :
                                (((Number) r[1]).doubleValue() * 100.0 / total)
                ))
                .toList();
    }

    /* ===================== GEOGRAPHY ===================== */

    public List<SimpleCountDto> topCountries() {
        return repository.topCountries()
                .stream()
                .map(r -> new SimpleCountDto(
                        (String) r[0],
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }
}
