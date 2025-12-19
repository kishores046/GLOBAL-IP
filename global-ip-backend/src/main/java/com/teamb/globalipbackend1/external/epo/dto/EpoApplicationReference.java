package com.teamb.globalipbackend1.external.epo.dto;


import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter
public class EpoApplicationReference {

    @JacksonXmlProperty(localName = "document-id")
    private EpoDocumentId documentId;

}
