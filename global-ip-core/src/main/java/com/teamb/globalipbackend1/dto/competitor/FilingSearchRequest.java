package com.teamb.globalipbackend1.dto.competitor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilingSearchRequest {
    private List<Long> competitorIds;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String jurisdiction;
    private Integer page = 0;
    private Integer size = 50;
}