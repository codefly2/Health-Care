package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.dto.TimeDto;
import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.repository.AppointmentRepository;
import com.wecp.healthcare_appointment_management_system.repository.DoctorRepository;
import com.wecp.healthcare_appointment_management_system.repository.PatientRepository;
import com.wecp.healthcare_appointment_management_system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public PatientController(PatientRepository patientRepository,
                             DoctorRepository doctorRepository,
                             AppointmentRepository appointmentRepository,
                             UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Patient> register(@RequestBody Patient patient) {
        // Save in patients table
        Patient saved = patientRepository.save(patient);
        // Mirror into users table for login support
        userRepository.save(new User(saved.getUsername(), saved.getPassword(), saved.getEmail(), "PATIENT"));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getDoctors() {
        List<Doctor> doctors = doctorRepository.findAllByOrderByIdAsc();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/appointment")
    public ResponseEntity<Appointment> scheduleAppointment(@RequestParam Long patientId,
                                                           @RequestParam Long doctorId,
                                                           @RequestBody TimeDto timeDto) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentTime(timeDto.getAppointmentTime());

        Appointment saved = appointmentRepository.save(appt);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientId(@RequestParam Long patientId) {
        List<Appointment> list = appointmentRepository.findByPatientIdOrderByAppointmentTimeAsc(patientId);
        return ResponseEntity.ok(list);
    }
}