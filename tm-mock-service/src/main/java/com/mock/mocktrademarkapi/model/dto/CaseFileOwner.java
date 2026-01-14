package com.mock.mocktrademarkapi.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class CaseFileOwner {

    @JacksonXmlProperty(localName = "party-name")
    private String partyName;

    @JacksonXmlProperty(localName = "state")
    private String state;


    @JacksonXmlProperty(localName = "nationality")
    private Nationality nationality;


}
