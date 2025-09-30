package com.wecp.healthcare_appointment_management_system.controller;

import com.wecp.healthcare_appointment_management_system.dto.LoginRequest;
import com.wecp.healthcare_appointment_management_system.dto.LoginResponse;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.Receptionist;
import com.wecp.healthcare_appointment_management_system.jwt.JwtUtil;
import com.wecp.healthcare_appointment_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ----------------- Registration -----------------

    // @PostMapping("/api/patient/register")
    // public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
    //     Patient savedPatient = userService.registerPatient(patient);
    //     return ResponseEntity.ok(savedPatient);
    // }

    // @PostMapping("/api/doctors/register")
    // public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
    //     Doctor savedDoctor = userService.registerDoctor(doctor);
    //     return ResponseEntity.ok(savedDoctor);
    // }

    // @PostMapping("/api/receptionist/register")
    // public ResponseEntity<Receptionist> registerReceptionist(@RequestBody Receptionist receptionist) {
    //     Receptionist savedReceptionist = userService.registerReceptionist(receptionist);
    //     return ResponseEntity.ok(savedReceptionist);
    // }

    // // ----------------- Login -----------------

    // @PostMapping("/api/user/login")
    // // public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
    // //     try {
    // //         // Authenticate using AuthenticationManager
    // //         authenticationManager.authenticate(
    // //                 new UsernamePasswordAuthenticationToken(
    // //                         loginRequest.getUsername(),
    // //                         loginRequest.getPassword()
    // //                 )
    // //         );

    //         // Load user details and generate JWT
    //         final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
    //         // final String jwt = jwtUtil.generateToken(userDetails);

    //         // return ResponseEntity.ok(new LoginResponse(jwt));

    //     } catch (BadCredentialsException ex) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     } catch (AuthenticationException ex) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     }
    // }
}
