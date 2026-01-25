package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString
public class EpoExchangeDocument {

    @JacksonXmlProperty(isAttribute = true, localName = "country")
    private String country;

    @JacksonXmlProperty(isAttribute = true, localName = "doc-number")
    private String docNumber;

    @JacksonXmlProperty(isAttribute = true, localName = "kind")
    private String kind;

    @JacksonXmlProperty(localName = "bibliographic-data")
    private EpoBibliographicData bibliographicData;
}
