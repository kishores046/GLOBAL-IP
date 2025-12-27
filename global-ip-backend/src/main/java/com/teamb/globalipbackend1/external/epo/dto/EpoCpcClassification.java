package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class EpoCpcClassification {

    @JacksonXmlProperty(isAttribute = true, localName = "sequence")
    private String sequence;

    @JacksonXmlProperty(localName = "text")
    private String text;

    @JacksonXmlProperty(localName = "section")
    private String section;

    @JacksonXmlProperty(localName = "class")
    private String classCode;

    @JacksonXmlProperty(localName = "subclass")
    private String subclass;

    @JacksonXmlProperty(localName = "main-group")
    private String mainGroup;

    @JacksonXmlProperty(localName = "subgroup")
    private String subgroup;

    @JacksonXmlProperty(localName = "classification-level")
    private String classificationLevel;

    @JacksonXmlProperty(localName = "classification-value")
    private String classificationValue;

    @JacksonXmlProperty(localName = "scheme")
    private String scheme;

    @JacksonXmlProperty(localName = "classification-data-source")
    private String classificationDataSource;

    public String getFullClassificationCode() {
        if (text != null && !text.isEmpty()) {
            return text;
        }

        StringBuilder code = new StringBuilder();
        if (section != null) code.append(section);
        if (classCode != null) code.append(classCode);
        if (subclass != null) code.append(subclass);
        if (mainGroup != null) {
            code.append(mainGroup);
            if (subgroup != null) {
                code.append("/").append(subgroup);
            }
        }
        return code.toString();
    }
}