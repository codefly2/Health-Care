package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.time.LocalDateTime;


public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tId;
    
    @ManyToOne

    private Patient patient;
    
    @ManyToOne
    private Doctor doctor;
    
    private LocalDateTime appointmentTime;
    
    private String status; // 'Scheduled', 'Completed', 'Canceled'
}
