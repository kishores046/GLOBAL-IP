package com.teamb.globalipbackend1.dto.citation;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitationEdge {
    private String source;
    private String target;
    private String citationType;
    private LocalDate citationDate;
    private Integer weight;
}