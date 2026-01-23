package com.teamb.globalipbackend1.dto.search;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class TrademarkSearchFilter {

    private String markName;
    private String country;
    private String state;

    private LocalDate filingDateFrom;
    private LocalDate filingDateTo;

    private String drawingCode;
    private String goodsAndServicesText;
}
