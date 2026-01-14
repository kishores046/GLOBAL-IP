package com.teamb.globalipbackend1.model.subscription;

public enum PlanType {
    FREE(1),
    BASIC(5),
    PRO(Integer.MAX_VALUE);

    private final int monitoringLimit;

    PlanType(int monitoringLimit) {
        this.monitoringLimit = monitoringLimit;
    }

    public int getMonitoringLimit() {
        return monitoringLimit;
    }
}
