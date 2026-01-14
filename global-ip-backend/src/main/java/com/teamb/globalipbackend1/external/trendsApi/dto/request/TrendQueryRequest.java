package com.teamb.globalipbackend1.external.trendsApi.dto.request;

import java.time.LocalDate;
import jakarta.validation.constraints.*;

public record TrendQueryRequest(
        @Min(1) @Max(1000) Integer limit,
        @PastOrPresent LocalDate startDate,
        LocalDate endDate
) {
    public TrendQueryRequest {
        if (limit == null) limit = 10;
        if (startDate == null) startDate = LocalDate.now().minusYears(5);
    }
}