package com.teamb.globalipbackend1.service.trademark;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TrademarkSnapshot {

    private String id;
    private String markName;
    private String jurisdiction;
    private String drawingCode;
    private LocalDate filingDate;
    private String statusCode;
    private Boolean standardCharacters;
    private List<String> owners;
    private List<String> internationalClasses;
    private List<String> goodsAndServices;
}

