package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EpoDocumentId {

    @JacksonXmlProperty(localName = "doc-number")
    private String docNumber;

    @JacksonXmlProperty(localName = "country")
    private String country;

    @JacksonXmlProperty(localName = "kind")
    private String kind;

    @JacksonXmlProperty(localName = "date")
    private String date;

}
