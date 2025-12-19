package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

import java.util.List;


@Getter
public class EpoParties {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "applicants")
    private List<EpoApplicant> applicants;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "inventors")
    private List<EpoInventor> inventors;

}
