package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.Entity;

@Entity
public class Receptionist extends User {
    private String shift;

    public Receptionist() {
    }

    public Receptionist(String username, String password, String email, String role, String shift) {
        super(username, password, email, role);
        this.shift = shift;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }
    
}