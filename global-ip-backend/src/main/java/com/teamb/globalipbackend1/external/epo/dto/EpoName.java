package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter
public class EpoName {

    @JacksonXmlProperty(localName = "name")
    private String value;

}
