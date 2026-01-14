package com.mock.mocktrademarkapi.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TradeMarkResponseDto {

    private String id;
    private String markName;
    private LocalDate filingDate;
    private String statusCode;
    private String drawingCode;
    private Boolean standardCharacters;

    private List<String> owners;
    private List<String> internationalClasses;
    private List<String> goodsAndServices;
}

