package com.teamb.globalipbackend1.dto.lifecycle;

import java.time.LocalDate;

public record TrademarkLifecycleDto(
        String trademarkId,
        LocalDate filingDate,
        String status,
        String rawStatusCode
) {}