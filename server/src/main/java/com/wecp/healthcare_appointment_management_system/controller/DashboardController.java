package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.entity.Appointment;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.service.AppointmentService;
import com.wecp.healthcare_appointment_management_system.service.DashboardService;
import com.wecp.healthcare_appointment_management_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;
    @GetMapping("/dashboard-data")
    public Map<String, Object> getDashboardData() {
        return dashboardService.getDashboardSummary();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam String role, @RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();

        switch (role.toLowerCase()) {
            case "receptionist":
                response = dashboardService.getReceptionistDashboard();
                break;
            case "doctor":
                response = dashboardService.getDoctorDashboard(userId);
                break;
            case "patient":
                response = dashboardService.getPatientDashboard(userId);
                break;
            default:
                response.put("error", "Invalid role");
        }

        return ResponseEntity.ok(response);
    }
}