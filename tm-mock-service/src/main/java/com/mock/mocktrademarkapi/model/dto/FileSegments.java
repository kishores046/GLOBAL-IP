package com.mock.mocktrademarkapi.model.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class FileSegments {

    @JacksonXmlProperty(localName = "action-keys")
    private ActionKeys actionKeys;
}
