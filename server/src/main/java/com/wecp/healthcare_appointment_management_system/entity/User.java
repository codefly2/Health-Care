package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.util.Set;


@Table(name = "users") // do not change table name
public class User {
   @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)

       private Long Id;

       private String username;

       private String password;

       private String role;

       private String email;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

       
}
