package com.teamb.globalipbackend1.dto.analyst;

import java.util.List;

public record TrendStatsResponse(
        List<Integer> yearlyCounts
) {}
