package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpoClaims {
    @JacksonXmlProperty(isAttribute = true, localName = "num")
    private String number;

    @JacksonXmlProperty(localName = "claim-text")
    private String text;
}