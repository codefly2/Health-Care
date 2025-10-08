package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.repository.AppointmentRepository;
import com.wecp.healthcare_appointment_management_system.repository.PatientRepository;
import com.wecp.healthcare_appointment_management_system.repository.ReceptionistRepository;
import com.wecp.healthcare_appointment_management_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private ReceptionistRepository receptionistRepository;
    @Autowired private DoctorService doctorService;

    private LocalDate toLocalDateSafe(Date time) {
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Doctor> doctors = doctorService.getDoctors();
        long doctorsCount = doctors.size();
        long doctorsAvailable = doctors.stream()
                .filter(d -> d.getAvailability() != null && !d.getAvailability().trim().isEmpty())
                .count();

        long patientsCount = patientRepository.count();
        long malePatients = patientRepository.countByGender("Male");
        long femalePatients = patientRepository.countByGender("Female");
        long receptionistCount = receptionistRepository.count();
        long appointmentsCount = appointmentRepository.count();

        LocalDate today = LocalDate.now();
        long todayAppointments = appointmentRepository.findAll().stream()
                .map(Appointment::getAppointmentTime)
                .map(this::toLocalDateSafe)
                .filter(Objects::nonNull)
                .filter(date -> date.equals(today))
                .count();

        long activityLevel = 86; // Static or calculated value

        Map<String, Object> res = new HashMap<>();
        res.put("doctors", doctorsCount);
        res.put("doctorsAvailable", doctorsAvailable);
        res.put("patients", patientsCount);
        res.put("malePatients", malePatients);
        res.put("femalePatients", femalePatients);
        res.put("receptionists", receptionistCount);
        res.put("appointments", appointmentsCount);
        res.put("todayAppointments", todayAppointments);
        res.put("activityLevel", activityLevel);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/appointments-trend")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsTrend() {
        List<Appointment> all = appointmentRepository.findAll();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        Map<LocalDate, Long> byDay = new HashMap<>();

        for (Appointment a : all) {
            LocalDate d = toLocalDateSafe(a.getAppointmentTime());
            if (d != null && !d.isBefore(start) && !d.isAfter(end)) {
                byDay.put(d, byDay.getOrDefault(d, 0L) + 1);
            }
        }

        List<Map<String, Object>> series = new ArrayList<>();
        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", cursor.toString());
            item.put("count", byDay.getOrDefault(cursor, 0L));
            series.add(item);
            cursor = cursor.plusDays(1);
        }

        return new ResponseEntity<>(series, HttpStatus.OK);
    }
}