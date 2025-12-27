package com.teamb.globalipbackend1.external.patentsview.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PatentsViewIpcClass {

    @JsonProperty("ipc_sequence")
    private Integer ipcSequence;

    @JsonProperty("ipc_class")
    private String ipcClass;

    @JsonProperty("ipc_subclass")
    private String ipcSubclass;

    @JsonProperty("ipc_main_group")
    private String ipcMainGroup;

    @JsonProperty("ipc_subgroup")
    private String ipcSubgroup;

    @JsonProperty("ipc_symbol_position")
    private String ipcSymbolPosition;

    @JsonProperty("ipc_classification_value")
    private String ipcClassificationValue;

    @JsonProperty("ipc_classification_data_source")
    private String ipcClassificationDataSource;

    @JsonProperty("ipc_action_date")
    private String ipcActionDate;

    @JsonProperty("ipc_version_indicator")
    private String ipcVersionIndicator;

    /**
     * Helper method to get full IPC classification code
     * Format: Section + Class + Subclass + MainGroup/Subgroup
     * Example: G06F16/30
     */
    public String getFullIpcCode() {
        if (ipcClass != null && !ipcClass.isBlank()) {
            return ipcClass.trim();
        }

        // Build from parts if ipcClass is not available
        StringBuilder code = new StringBuilder();

        if (ipcSubclass != null && !ipcSubclass.isBlank()) {
            code.append(ipcSubclass);  // e.g., "G06F"
        }

        if (ipcMainGroup != null && !ipcMainGroup.isBlank()) {
            code.append(ipcMainGroup);  // e.g., "16"

            if (ipcSubgroup != null && !ipcSubgroup.isBlank()) {
                code.append("/").append(ipcSubgroup);  // e.g., "/30"
            }
        }

        return code.toString().trim();
    }
}