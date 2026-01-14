package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PatentsViewInventor {
    private String inventor;

    @JsonProperty("inventor_id")
    private String inventorId;

    @JsonProperty("inventor_name_first")
    private String inventorFirstName;

    @JsonProperty("inventor_name_last")
    private String inventorLastName;

    @JsonProperty("inventor_gender_code")
    private String inventorGenderCode;

    @JsonProperty("inventor_location_id")
    private String inventorLocationId;

    @JsonProperty("inventor_city")
    private String inventorCity;

    @JsonProperty("inventor_state")
    private String inventorState;

    @JsonProperty("inventor_country")
    private String inventorCountry;

    @JsonProperty("inventor_sequence")
    private String inventorSequence;
}
