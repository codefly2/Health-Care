package com.wecp.healthcare_appointment_management_system.entity;

import javax.persistence.*;
import java.util.Set;


public class Doctor extends User {
   private String specialty;
   private String availability;
   @OneToMany(mappedBy = "doctor",cascade = CascadeType.ALL)
   private Set<Appointment> appointments;
   @OneToMany(mappedBy = "doctor",cascade = CascadeType.ALL)
   private Set<MedicalRecord> medicalRecords;
   public Doctor(){}
   
   public Doctor(String username, String password, String email, String role, String specialty,
    String availability) {
      super(username, password, email, role);
      this.specialty = specialty;
      this.availability = availability;

   }

   public String getSpecialty() {
      return specialty;
   }

   public void setSpecialty(String specialty) {
      this.specialty = specialty;
   }

   public String getAvailability() {
      return availability;
   }

   public void setAvailability(String availability) {
      this.availability = availability;
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
