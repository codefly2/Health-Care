package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String diagnosis;
    private String treatment;
    @ManyToOne private Patient patient;
    @ManyToOne private Doctor doctor;
    public MedicalRecord() {
    }
    public MedicalRecord(String diagnosis, String treatment, Patient patient, Doctor doctor) {
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.patient = patient;
        this.doctor = doctor;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDiagnosis() {
        return diagnosis;
    }
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }
    public String getTreatment() {
        return treatment;
    }
    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }
    public Patient getPatient() {
        return patient;
    }
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    public Doctor getDoctor() {
        return doctor;
    }
    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
    
}
