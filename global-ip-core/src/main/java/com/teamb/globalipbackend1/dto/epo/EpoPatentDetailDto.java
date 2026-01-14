package com.teamb.globalipbackend1.dto.epo;

import com.teamb.globalipbackend1.dto.lifecycle.ApplicationLifecycleDto;

import java.time.LocalDate;
import java.util.List;

public class EpoPatentDetailDto {

    private String publicationNumber;
    private String jurisdiction;
    private String wipoKind;
    private String title;
    private String abstractText;

    private LocalDate filingDate;
    private LocalDate grantDate;
    private LocalDate expirationDate;

    private List<String> assignees;
    private List<String> inventors;
    private List<String> ipcClasses;
    private List<String> cpcClasses;

    private Integer timesCited;
    private Integer totalCitations;

    private ApplicationLifecycleDto lifecycle;

    // Getters and Setters
    public String getPublicationNumber() {
        return publicationNumber;
    }

    public void setPublicationNumber(String publicationNumber) {
        this.publicationNumber = publicationNumber;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getWipoKind() {
        return wipoKind;
    }

    public void setWipoKind(String wipoKind) {
        this.wipoKind = wipoKind;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public LocalDate getFilingDate() {
        return filingDate;
    }

    public void setFilingDate(LocalDate filingDate) {
        this.filingDate = filingDate;
    }

    public LocalDate getGrantDate() {
        return grantDate;
    }

    public void setGrantDate(LocalDate grantDate) {
        this.grantDate = grantDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public List<String> getInventors() {
        return inventors;
    }

    public void setInventors(List<String> inventors) {
        this.inventors = inventors;
    }

    public List<String> getIpcClasses() {
        return ipcClasses;
    }

    public void setIpcClasses(List<String> ipcClasses) {
        this.ipcClasses = ipcClasses;
    }

    public List<String> getCpcClasses() {
        return cpcClasses;
    }

    public void setCpcClasses(List<String> cpcClasses) {
        this.cpcClasses = cpcClasses;
    }

    public Integer getTimesCited() {
        return timesCited;
    }

    public void setTimesCited(Integer timesCited) {
        this.timesCited = timesCited;
    }

    public Integer getTotalCitations() {
        return totalCitations;
    }

    public void setTotalCitations(Integer totalCitations) {
        this.totalCitations = totalCitations;
    }

    public ApplicationLifecycleDto getLifecycle() {
        return lifecycle;
    }

    public void setLifecycle(ApplicationLifecycleDto lifecycle) {
        this.lifecycle = lifecycle;
    }
}














