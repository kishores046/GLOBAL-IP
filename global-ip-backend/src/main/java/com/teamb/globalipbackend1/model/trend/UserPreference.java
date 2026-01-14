package com.teamb.globalipbackend1.model.trend;



import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "user_preference")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private Integer defaultLimit = 10;
    private Integer defaultYearRange = 5;
    private String favoriteAssignees;
    private String favoriteTechnologies;
}