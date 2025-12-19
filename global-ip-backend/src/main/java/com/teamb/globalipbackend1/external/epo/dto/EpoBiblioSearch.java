package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter

public class EpoBiblioSearch {

    @JacksonXmlProperty(localName = "search-result")
    private EpoSearchResult searchResult;
}
