package com.teamb.globalipbackend1.external.epo.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EpoAbstract {

    @JacksonXmlProperty(isAttribute = true, localName = "lang")
    private String lang;

    // Direct text content (for simple abstracts)
    @JacksonXmlText
    private String value;

    // Nested paragraph tags (for structured abstracts)
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "p")
    private List<EpoAbstractParagraph> paragraphs;

    /**
     * Returns the full abstract text, combining direct text and paragraphs
     */
    public String getFullText() {
        StringBuilder text = new StringBuilder();

        // Add direct text if present
        if (value != null && !value.isBlank()) {
            text.append(value.trim());
        }

        // Add paragraphs if present
        if (paragraphs != null && !paragraphs.isEmpty()) {
            for (EpoAbstractParagraph p : paragraphs) {
                if (p.getText() != null && !p.getText().isBlank()) {
                    if (!text.isEmpty()) {
                        text.append(" ");
                    }
                    text.append(p.getText().trim());
                }
            }
        }

        String result = text.toString().trim();
        return result.isEmpty() ? null : result;
    }

    @Getter
    @Setter
    public static class EpoAbstractParagraph {
        @JacksonXmlText
        private String text;
    }
}