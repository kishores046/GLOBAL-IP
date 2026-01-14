package com.mock.mocktrademarkapi.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Classification {

    @JacksonXmlProperty(localName = "international-code")
    private String internationalCode;

    @JacksonXmlProperty(localName = "primary-code")
    private String primaryCode;
}