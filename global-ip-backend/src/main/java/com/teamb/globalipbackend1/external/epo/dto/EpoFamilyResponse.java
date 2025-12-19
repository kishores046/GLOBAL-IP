package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.*;
import lombok.Getter;

import java.util.List;

@Getter
@JacksonXmlRootElement(localName = "exchange-documents")
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpoFamilyResponse {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "exchange-document")
    private List<EpoExchangeDocument> documents;

    public List<EpoExchangeDocument> safeDocuments() {
        return documents == null ? List.of() : documents;
    }
}


