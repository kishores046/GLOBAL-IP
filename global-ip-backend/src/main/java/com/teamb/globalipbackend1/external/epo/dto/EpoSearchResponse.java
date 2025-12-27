package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;

@Getter
@JacksonXmlRootElement(
        localName = "world-patent-data",
        namespace = "http://ops.epo.org"
)
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpoSearchResponse {

    @JacksonXmlProperty(localName = "biblio-search", namespace = "http://ops.epo.org")
    private EpoBiblioSearch biblioSearch;
}