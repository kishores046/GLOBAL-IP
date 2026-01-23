package com.mock.mocktrademarkapi.model.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)
@Getter @Setter
public class ActionKeys {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "action-key")
    private List<String> actionKeys;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "case-file")
    private List<CaseFile> caseFileList;
}
