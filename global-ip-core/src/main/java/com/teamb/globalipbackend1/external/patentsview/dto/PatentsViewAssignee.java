package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)  // CRITICAL: Ignore any unknown fields from API
public class PatentsViewAssignee {

    @JsonProperty("assignee")
    private String assignee;

    @JsonProperty("assignee_id")
    private String assigneeId;

    @JsonProperty("assignee_type")  // NEW FIELD - was causing the error
    private String assigneeType;

    @JsonProperty("assignee_individual_name_first")
    private String assigneeIndividualFirstName;

    @JsonProperty("assignee_individual_name_last")
    private String assigneeIndividualLastName;

    @JsonProperty("assignee_organization")
    private String assigneeOrganisation;

    @JsonProperty("assignee_city")
    private String assigneeCity;

    @JsonProperty("assignee_state")
    private String assigneeState;

    @JsonProperty("assignee_country")
    private String assigneeCountry;

    @JsonProperty("assignee_sequence")
    private Integer assigneeSequence;  // Changed to Integer (nullable)

    @JsonProperty("assignee_location_id")  // Sometimes present in response
    private String assigneeLocationId;
}