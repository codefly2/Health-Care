package com.wecp.healthcare_appointment_management_system.controller;


import com.wecp.healthcare_appointment_management_system.dto.LoginRequest;
import com.wecp.healthcare_appointment_management_system.dto.LoginResponse;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.Receptionist;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.jwt.JwtUtil;
import com.wecp.healthcare_appointment_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


public class RegisterAndLoginController {




    @PostMapping("/api/patient/register")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
            return null;
        // register patient
    }

    @PostMapping("/api/doctors/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
            return null;
        // register doctor
    }

    @PostMapping("/api/receptionist/register")
    public ResponseEntity<Receptionist> registerReceptionist(@RequestBody Receptionist receptionist) {
            return null;
       // register receptionist
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
            return null;
      // login user and return jwt in LoginResponse object
        // return 401 unauthorized if authentication fail
    }
}
