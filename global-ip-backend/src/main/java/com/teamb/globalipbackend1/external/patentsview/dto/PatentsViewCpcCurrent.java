package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatentsViewCpcCurrent {

    @JsonProperty("cpc_sequence")
    private int cpcSequence;

    @JsonProperty("cpc_class")
    private String cpcClass;

    @JsonProperty("cpc_class_id")
    private String cpcClassID;

    @JsonProperty("cpc_subclass")
    private String cpcSubclass;

    @JsonProperty("cpc_subclass_id")
    private String cpcSubclassID;

    @JsonProperty("cpc_group")
    private String cpcGroup;

    @JsonProperty("cpc_group_id")
    private String cpcGroupID;



}
