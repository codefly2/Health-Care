package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Patient extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private Set<Appointment> appointments;
    @OneToMany(mappedBy = "patient",cascade = CascadeType.ALL)
    private Set<MedicalRecord> medicalRecords;

    public Patient() {
    }
    public Patient(String username, String password, String email, String role) {
        super(username, password, email, role);
    }
    public Set<Appointment> getAppointments() {
        return appointments;
    }
    public void setAppointments(Set<Appointment> appointments) {
        this.appointments = appointments;
    }
    public Set<MedicalRecord> getMedicalRecords() {
        return medicalRecords;
    }
    public void setMedicalRecords(Set<MedicalRecord> medicalRecords) {
        this.medicalRecords = medicalRecords;
    }
    
    

}
