package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;

@JacksonXmlRootElement(localName = "biblio-search")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class EpoSearchResponse {
    @JacksonXmlProperty(localName = "biblio-search")
    private EpoBiblioSearch biblioSearch;
}
