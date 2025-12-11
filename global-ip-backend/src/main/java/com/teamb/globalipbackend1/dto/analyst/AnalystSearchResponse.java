package com.teamb.globalipbackend1.dto.analyst;

import java.util.List;

public record AnalystSearchResponse(
        String query,
        List<String> mockResults,
        String message
) {}
