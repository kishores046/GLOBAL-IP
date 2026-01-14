package com.mock.mocktrademarkapi.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class CaseFileStatement {

    @JacksonXmlProperty(localName = "type-code")
    private String typeCode;

    @JacksonXmlProperty(localName = "text")
    private String text;
}
