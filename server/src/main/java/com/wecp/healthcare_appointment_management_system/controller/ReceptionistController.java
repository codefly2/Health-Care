package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.dto.TimeDto;
import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.Receptionist;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.repository.AppointmentRepository;
import com.wecp.healthcare_appointment_management_system.repository.DoctorRepository;
import com.wecp.healthcare_appointment_management_system.repository.PatientRepository;
import com.wecp.healthcare_appointment_management_system.repository.ReceptionistRepository;
import com.wecp.healthcare_appointment_management_system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
public class ReceptionistController {

    private final ReceptionistRepository receptionistRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public ReceptionistController(ReceptionistRepository receptionistRepository,
                                  AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository,
                                  DoctorRepository doctorRepository,
                                  UserRepository userRepository) {
        this.receptionistRepository = receptionistRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Receptionist> registerReceptionist(@RequestBody Receptionist receptionist) {
        Receptionist saved = receptionistRepository.save(receptionist);
        userRepository.save(new User(saved.getUsername(), saved.getPassword(), saved.getEmail(), "RECEPTIONIST"));
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> list = appointmentRepository.findAllByOrderByAppointmentTimeAsc();
        return ResponseEntity.ok(list);
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

    @PutMapping("/appointment-reschedule/{appointmentId}")
    public ResponseEntity<Appointment> rescheduleAppointment(@PathVariable Long appointmentId,
                                                             @RequestBody TimeDto timeDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        appointment.setAppointmentTime(timeDto.getAppointmentTime());
        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }
}