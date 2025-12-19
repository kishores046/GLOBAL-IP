package com.teamb.globalipbackend1.model.patents;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class PatentDocument {

    private String publicationNumber;
    private String title;
    private String jurisdiction;
    private LocalDate publicationDate;
    private List<String> assignees;
    private List<String> inventors;
}
