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

    // IPC Classifications - handle both wrapper and direct list
    @JacksonXmlProperty(localName = "classifications-ipcr")
    private EpoIpcClassifications ipcClassifications;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "classification-ipcr")
    private List<EpoIpcClassification> ipcClassificationsList;


    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "patent-classification")
    private List<EpoCpcClassification> cpcClassifications;


    public List<EpoIpcClassification> getIpcList() {
        if (ipcClassificationsList != null && !ipcClassificationsList.isEmpty()) {
            return ipcClassificationsList;
        }
        if (ipcClassifications != null && ipcClassifications.getList() != null) {
            return ipcClassifications.getList();
        }
        return List.of();
    }

    public List<EpoCpcClassification> getCpcList() {
        return cpcClassifications != null ? cpcClassifications : List.of();
    }
}