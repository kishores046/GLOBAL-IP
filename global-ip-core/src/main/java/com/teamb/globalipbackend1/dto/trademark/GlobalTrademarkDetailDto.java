package com.teamb.globalipbackend1.dto.trademark;



import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class GlobalTrademarkDetailDto {

    private String id;
    private String markName;
    private String jurisdiction;

    private LocalDate filingDate;
    private String statusCode;
    private String drawingCode;
    private Boolean standardCharacters;
    private List<String> owners;
    private List<String> internationalClasses;
    private List<String> goodsAndServices;

    private boolean bookmarked;
}
