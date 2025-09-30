package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Patient patient;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Doctor doctor;

    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentTime;

    public Appointment() {}

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public Date getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(Date appointmentTime) { this.appointmentTime = appointmentTime; }
}