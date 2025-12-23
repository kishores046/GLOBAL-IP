package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PatentsViewWipo {

    @JsonProperty("wipo_field")
    private String wipoField;

    @JsonProperty("wipo_field_id")
    private String wipoFieldId;

    @JsonProperty("wipo_sequence")
    private String wipoSequence;
}
