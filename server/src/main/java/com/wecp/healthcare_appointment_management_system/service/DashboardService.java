package com.wecp.healthcare_appointment_management_system.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wecp.healthcare_appointment_management_system.repository.AppointmentRepository;
import com.wecp.healthcare_appointment_management_system.repository.DoctorRepository;
import com.wecp.healthcare_appointment_management_system.repository.PatientRepository;

@Service
public class DashboardService {

    @Autowired
    private AppointmentRepository appointmentRepo;
    @Autowired
    private DoctorRepository doctorRepo;
    @Autowired
    private PatientRepository patientRepo;

    public Map<String, Object> getReceptionistDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalPatients", patientRepo.count());
        data.put("totalAppointments", appointmentRepo.count());
      //  data.put("todayAppointments", appointmentRepo.findTodayAppointments().size());
     //   data.put("chartData", appointmentRepo.getWeeklyAppointmentStats());
        return data;
    }

    public Map<String, Object> getDoctorDashboard(Long doctorId) {
        Map<String, Object> data = new HashMap<>();
      //  data.put("totalPatients", appointmentRepo.findDistinctPatientsByDoctorId(doctorId).size());
      //  data.put("todayAppointments", appointmentRepo.findTodayAppointmentsByDoctor(doctorId));
     //   data.put("chartData", appointmentRepo.getDoctorAppointmentTrend(doctorId));
        return data;
    }

    public Map<String, Object> getPatientDashboard(Long patientId) {
        Map<String, Object> data = new HashMap<>();
     //   data.put("upcomingAppointments", appointmentRepo.findUpcomingAppointmentsByPatient(patientId));
        data.put("recentReports", List.of("Blood Test", "X-ray", "MRI"));
        data.put("vitals", Map.of("bp", "120/80", "pulse", 72, "temp", 36.6));
        return data;
    }

public Map<String, Object> getDashboardSummary() {
        Map<String, Object> data = new HashMap<>();

        long totalDoctors = doctorRepo.count();
        long totalPatients = patientRepo.count();
        long totalAppointments = appointmentRepo.count();
        long pendingAppointments = appointmentRepo.countByStatus("Pending");

        data.put("totalDoctors", totalDoctors);
        data.put("totalPatients", totalPatients);
        data.put("totalAppointments", totalAppointments);
        data.put("pendingAppointments", pendingAppointments);

        // Optional: Weekly summary chart data
        List<Map<String, Object>> weeklyAppointments = appointmentRepo.getWeeklySummary();
        data.put("weeklyAppointments", weeklyAppointments);

        return data;
    }

}