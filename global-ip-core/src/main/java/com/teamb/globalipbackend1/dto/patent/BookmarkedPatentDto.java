package com.teamb.globalipbackend1.dto.patent;



import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookmarkedPatentDto {

    private String publicationNumber;
    private String title;
    private String jurisdiction;
    private LocalDate filingDate;
    private LocalDate grantDate;
    private String source;
}
