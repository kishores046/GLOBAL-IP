package com.mock.mocktrademarkapi.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;
import lombok.Setter;


@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class CaseFile {

    @JacksonXmlProperty(localName = "serial-number")
    private String serialNumber;

    @JacksonXmlProperty(localName = "registration-number")
    private String registrationNumber;

    @JacksonXmlProperty(localName = "case-file-header")
    private CaseFileHeader caseFileHeader;

    @JacksonXmlProperty(localName = "case-file-statements")
    private CaseFileStatements caseFileStatements;

    @JacksonXmlProperty(localName = "classifications")
    private Classifications classifications;

    @JacksonXmlProperty(localName = "case-file-owners")
    private CaseFileOwners caseFileOwners;
}
