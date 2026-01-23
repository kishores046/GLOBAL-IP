package com.teamb.globalipbackend1.service.lifecycle;



public final class TrademarkLifecycleCalculator {

    private TrademarkLifecycleCalculator() {}

    public static String computeStatus(String statusCode) {
        if (statusCode == null) return "FILED";

        int code;
        try {
            code = Integer.parseInt(statusCode);
        } catch (Exception e) {
            return "FILED";
        }

        if (code >= 900) return "CANCELLED";
        if (code >= 800) return "REGISTERED";
        if (code >= 700) return "PUBLISHED";

        return "FILED";
    }
}
