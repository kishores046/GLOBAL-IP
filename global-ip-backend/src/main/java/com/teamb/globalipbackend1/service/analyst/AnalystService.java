package com.teamb.globalipbackend1.service.analyst;

import com.teamb.globalipbackend1.dto.analyst.AnalystSearchResponse;
import com.teamb.globalipbackend1.dto.analyst.BasicStatisticsResponse;
import com.teamb.globalipbackend1.dto.analyst.TrendStatsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalystService {

    public AnalystSearchResponse mockSearch(String query) {
        return new AnalystSearchResponse(
                query,
                List.of(), // mock empty list
                "Search engine will be added in Milestone 2"
        );
    }

    public BasicStatisticsResponse mockBasicStats() {
        return new BasicStatisticsResponse(
                0, 0, 0 // dummy values
        );
    }

    public TrendStatsResponse mockTrendStats() {
        return new TrendStatsResponse(
                List.of(5, 8, 12, 15) // mock trend
        );
    }
}

