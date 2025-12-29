package com.teamb.globalipbackend1.dto.search;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class GlobalSearchRequest {

    private String keyword;
    private String jurisdiction;

    private LocalDate filingDateFrom;
    private LocalDate filingDateTo;

    private String assignee;   // patents
    private String inventor;   // patents

    private String owner;      // trademarks
    private String state;      // trademarks

    public PatentSearchFilter toPatentFilter() {
        PatentSearchFilter f = new PatentSearchFilter();

        f.setKeyword(keyword);
        f.setJurisdiction(jurisdiction);
        f.setFilingDateFrom(filingDateFrom);
        f.setFilingDateTo(filingDateTo);
        f.setAssignee(assignee);
        f.setInventor(inventor);
        return f;
    }

    public TrademarkSearchFilter toTrademarkFilter() {

        TrademarkSearchFilter f = new TrademarkSearchFilter();
        f.setGoodsAndServicesText(this.keyword);
        f.setCountry(this.jurisdiction);
        f.setState(this.state);
        f.setFilingDateFrom(this.filingDateFrom);
        f.setFilingDateTo(this.filingDateTo);
        return f;
    }
}
