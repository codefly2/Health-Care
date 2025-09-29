package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.service.AppointmentService;
import com.wecp.healthcare_appointment_management_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


public class DoctorController {


    @GetMapping("/api/doctor/appointments")
    public ResponseEntity<List<Appointment>> viewAppointments(@RequestParam Long doctorId) {
            return null;
        // view appointments
    }

    @PostMapping("/api/doctor/availability")
    public ResponseEntity<Doctor> manageAvailability(@RequestParam Long doctorId, @RequestParam String availability) {
            return null;
        // manage availablity
    }
}
