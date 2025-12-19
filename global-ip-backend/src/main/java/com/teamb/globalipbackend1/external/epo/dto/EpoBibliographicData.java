package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.*;
import lombok.Getter;

import java.util.List;

@Getter
public class EpoBibliographicData {


    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "invention-title")
    private List<EpoTitle> inventionTitles;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "abstract")
    private List<EpoAbstract> abstracts;

    @JacksonXmlProperty(localName = "application-reference")
    private EpoApplicationReference applicationReference;

    @JacksonXmlProperty(localName = "publication-reference")
    private EpoPublicationReference publicationReference;

    @JacksonXmlProperty(localName = "parties")
    private EpoParties parties;


}
