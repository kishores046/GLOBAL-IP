package com.mock.mocktrademarkapi.domain;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum TrademarkStatus {

    // ===================== ABANDONED =====================
    S600("600", "Abandoned – Incomplete", "Warehouse"),
    S601("601", "Abandoned – Express", "Warehouse"),
    S602("602", "Abandoned – Failure to Respond", "Warehouse"),
    S603("603", "Abandoned – After ex parte Appeal", "Warehouse"),
    S604("604", "Abandoned – After inter partes decision", "Warehouse"),
    S605("605", "Abandoned – After Publication", "Warehouse"),
    S606("606", "Abandoned – No Statement of Use filed", "Warehouse"),
    S607("607", "Abandoned – Defective Statement of Use", "Warehouse"),
    S608("608", "Abandoned – After Petition Decision", "Warehouse"),
    S609("609", "Abandoned – Defective Divided Application", "Warehouse"),
    S614("614", "Abandoned – Petition to revive denied", "Warehouse"),

    // ===================== APPLICATION =====================
    S630("630", "New Application – Record initialized", "Law Office"),
    S631("631", "Divided Application – Initial processing", "ITU Unit"),
    S632("632", "Informal Application", "Pre-Exam"),
    S638("638", "Assigned to Examiner", "Law Office"),

    // ===================== OFFICE ACTIONS =====================
    S640("640", "Non-Final Action – Not mailed", "Law Office"),
    S641("641", "Non-Final Action – Mailed", "Law Office"),
    S645("645", "Final Refusal – Mailed", "Law Office"),
    S647("647", "Examiner’s Amendment – Mailed", "Law Office"),
    S653("653", "Suspension Letter – Mailed", "Law Office"),
    S661("661", "Response after Non-Final Action – Entered", "Law Office"),
    S663("663", "Response after Final Rejection – Entered", "Law Office"),
    S666("666", "Notice of Unresponsive Amendment – Mailed", "Law Office"),

    // ===================== PUBLICATION =====================
    S680("680", "Approved for Publication", "Law Office"),
    S681("681", "Publication / Registration Review Complete", "Pub. and Issue"),
    S686("686", "Published for Opposition", "Pub. and Issue"),
    S692("692", "Withdrawn from Publication", "Pub. and Issue"),

    // ===================== REGISTRATION =====================
    S700("700", "Registered", "Warehouse"),
    S701("701", "Section 8 Accepted", "Post-Registration"),
    S702("702", "Section 8 & 15 Accepted", "Post-Registration"),
    S703("703", "Section 15 Acknowledged", "Post-Registration"),
    S710("710", "Cancelled – Section 8", "Warehouse"),
    S711("711", "Cancelled – Section 7(d)", "Warehouse"),
    S713("713", "Cancelled – Section 18", "Warehouse"),
    S715("715", "Cancelled – Restored to Pendency", "Law Office"),

    // ===================== ITU / STATEMENT OF USE =====================
    S688("688", "Notice of Allowance – Issued", "ITU Unit"),
    S730("730", "First Extension – Granted", "ITU Unit"),
    S731("731", "Second Extension – Granted", "ITU Unit"),
    S732("732", "Third Extension – Granted", "ITU Unit"),
    S733("733", "Fourth Extension – Granted", "ITU Unit"),
    S734("734", "Fifth Extension – Granted", "ITU Unit"),
    S744("744", "Statement of Use – Filed", "ITU Unit"),
    S748("748", "Statement of Use – To Examiner", "Law Office"),

    // ===================== TTAB =====================
    S760("760", "Ex parte Appeal Pending", "TTAB"),
    S762("762", "Ex parte Appeal – Refusal Reversed", "TTAB"),
    S763("763", "Ex parte Appeal – Refusal Affirmed", "TTAB"),
    S774("774", "Opposition Pending", "TTAB"),
    S775("775", "Opposition Dismissed", "TTAB"),
    S777("777", "Opposition Terminated", "TTAB"),
    S780("780", "Cancellation Terminated", "TTAB"),
    S790("790", "Cancellation Pending", "TTAB"),

    // ===================== POST REG / RENEWAL =====================
    S800("800", "Renewed", "Post-Registration"),
    S900("900", "Expired", "Warehouse"),

    // ===================== FALLBACK =====================
    UNKNOWN("UNKNOWN", "Unknown Status", "Unknown");

    private final String code;
    private final String description;
    private final String category;

    TrademarkStatus(String code, String description, String category) {
        this.code = code;
        this.description = description;
        this.category = category;
    }

    public String description() {
        return description;
    }

    public String category() {
        return category;
    }

    private static final Map<String, TrademarkStatus> LOOKUP =
            Stream.of(values())
                    .collect(Collectors.toMap(s -> s.code, s -> s));

    public static TrademarkStatus fromCode(String code) {
        return LOOKUP.getOrDefault(code, UNKNOWN);
    }
}
