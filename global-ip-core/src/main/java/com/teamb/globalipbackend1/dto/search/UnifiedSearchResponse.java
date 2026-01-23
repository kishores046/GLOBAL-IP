package com.teamb.globalipbackend1.dto.search;

import com.teamb.globalipbackend1.model.patents.PatentDocument;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UnifiedSearchResponse {

    private List<PatentDocument> patents;
    private List<TrademarkResultDto> trademarks;
}
