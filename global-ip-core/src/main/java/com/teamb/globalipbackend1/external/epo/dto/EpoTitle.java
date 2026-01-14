package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import lombok.Getter;

@Getter
public class EpoTitle {

    @JacksonXmlProperty(isAttribute = true, localName = "lang")
    private String lang;

    @JacksonXmlText
    private String value;

}
