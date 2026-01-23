package com.mock.mocktrademarkapi.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Classifications {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "classification")
    private List<Classification> classifications;
}
