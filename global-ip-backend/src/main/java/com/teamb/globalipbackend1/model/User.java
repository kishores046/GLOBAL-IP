package com.teamb.globalipbackend1.model;


import com.teamb.globalipbackend1.util.id.PrefixedId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="users")
@NoArgsConstructor
@Getter @Setter
public class User {
    @Id
    @PrefixedId
    @Column(name="user_id",nullable = false,updatable = false)
    private String userId;

    @Column(nullable = false,name = "username")
    private String username;

    @Column(name = "email",nullable = false)
    private String email;


    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(
                    name = "user_id",
                    referencedColumnName = "user_id",
                    foreignKey = @ForeignKey(name = "fk_user_role_user")
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id",
                    referencedColumnName = "role_id",
                    foreignKey = @ForeignKey(name = "fk_user_role_role")
            )
    )
    private Set<Role> roles = new HashSet<>();

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name="location")
    private String location;

    @Column(name="company")
    private String company;

    @Column(name="position")
    private String position;

    @Column(name="bio")
    private String bio;

    @Column(nullable = false,name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false,name = "updated_at")
    private LocalDateTime updatedAt;

    public User(String username, String email, String password, Set<Role> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }


    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate(){
        this.updatedAt=LocalDateTime.now();
    }

    public String getUser_id() {
        return userId;
    }

    public void setUser_id(String userId) {
        this.userId = userId;
    }


}
