package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.repository.AppointmentRepository;
import com.wecp.healthcare_appointment_management_system.repository.DoctorRepository;
import com.wecp.healthcare_appointment_management_system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DoctorController(DoctorRepository doctorRepository,
                            AppointmentRepository appointmentRepository,
                            UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // Registration for doctor
    @PostMapping("/api/doctors/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        Doctor saved = doctorRepository.save(doctor);
        userRepository.save(new User(saved.getUsername(), saved.getPassword(), saved.getEmail(), "DOCTOR"));
        return ResponseEntity.ok(saved);
    }

    // Get appointments for a doctor
    @GetMapping("/api/doctor/appointments")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorId(@RequestParam Long doctorId) {
        List<Appointment> list = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(list);
    }

    // Update availability
    @PostMapping("/api/doctor/availability")
    public ResponseEntity<Doctor> updateAvailability(@RequestParam Long doctorId,
                                                     @RequestParam String availability) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        doctor.setAvailability(availability);
        Doctor updated = doctorRepository.save(doctor);
        return ResponseEntity.ok(updated);
    }
}