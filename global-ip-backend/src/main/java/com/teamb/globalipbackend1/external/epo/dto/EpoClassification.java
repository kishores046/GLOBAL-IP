package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpoClassification {

    private List<EpoIpcClassification> ipcList = new ArrayList<>();
    private List<EpoCpcClassification> cpcList = new ArrayList<>();
}
