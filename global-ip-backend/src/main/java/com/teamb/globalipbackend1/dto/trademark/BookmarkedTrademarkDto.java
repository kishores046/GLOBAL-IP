package com.teamb.globalipbackend1.dto.trademark;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookmarkedTrademarkDto {

    private String trademarkId;
    private String markName;
    private String jurisdiction;
    private LocalDate filingDate;
    private String statusCode;
    private String source;
}
