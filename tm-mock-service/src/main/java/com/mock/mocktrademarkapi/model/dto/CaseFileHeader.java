package com.mock.mocktrademarkapi.model.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.Getter;
import lombok.Setter;


@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class CaseFileHeader {
    @JacksonXmlProperty(localName = "mark-identification")
    private String markName;

    @JacksonXmlProperty(localName = "filing-date")
    private String filingDate;

    @JacksonXmlProperty(localName = "status-code")
    private String statusCode;

    @JacksonXmlProperty(localName = "mark-drawing-code")
    private String drawingCode;

    @JacksonXmlProperty(localName = "standard-characters-claimed-in")
    private String standardCharactersRaw;

}
