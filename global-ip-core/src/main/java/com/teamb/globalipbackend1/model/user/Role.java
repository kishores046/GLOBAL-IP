package com.teamb.globalipbackend1.model.user;

import com.teamb.globalipbackend1.util.id.PrefixedId;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public  class Role {
    public Role() {

    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Id
    @PrefixedId
    @Column(name = "role_id",nullable = false)
    private String roleId;

    @Column(nullable = false,name = "role_type")
    private String roleType;

    public Role(String roleType) {
        this.roleType = roleType;
    }

    @ManyToMany(mappedBy = "roles")
    private Set<User> users=new HashSet<>();





}