package com.teamb.globalipbackend1.service.trademark;



import com.teamb.globalipbackend1.dto.trademark.*;
import com.teamb.globalipbackend1.dto.trademark.trend.CodeDistributionDto;
import com.teamb.globalipbackend1.dto.trademark.trend.SimpleCountDto;
import com.teamb.globalipbackend1.external.usptotm.TrademarkTrendClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TrademarkTrendService {

    private final TrademarkTrendClient client;

    public Map<String, Object> summary() {
        return client.getSummary();
    }

    public List<CodeDistributionDto> topClasses() {
        return client.topClasses();
    }

    public List<SimpleCountDto> topCountries() {
        return client.topCountries();
    }

    public List<SimpleCountDto> statusDistribution() {
        return client.statusDistribution();
    }
}
