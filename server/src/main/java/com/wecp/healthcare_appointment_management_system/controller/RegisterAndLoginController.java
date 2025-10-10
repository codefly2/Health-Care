package com.wecp.healthcare_appointment_management_system.controller;
import com.wecp.healthcare_appointment_management_system.dto.LoginRequest;
import com.wecp.healthcare_appointment_management_system.dto.LoginResponse;
import com.wecp.healthcare_appointment_management_system.entity.Doctor;
import com.wecp.healthcare_appointment_management_system.entity.Patient;
import com.wecp.healthcare_appointment_management_system.entity.Receptionist;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.jwt.JwtUtil;
import com.wecp.healthcare_appointment_management_system.service.OtpService;
import com.wecp.healthcare_appointment_management_system.service.UserService;

import com.wecp.healthcare_appointment_management_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    private AuthenticationManager authenticationManager;


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @PostMapping("/api/patient/register")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
        Patient registeredPatient = (Patient) userService.registerUser(patient);
        return new ResponseEntity<>(registeredPatient, HttpStatus.CREATED);
    }

    @PostMapping("/api/doctors/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        Doctor registeredDoctor = (Doctor) userService.registerUser(doctor);
        return new ResponseEntity<>(registeredDoctor, HttpStatus.CREATED);
    }

    @PostMapping("/api/receptionist/register")
    public ResponseEntity<Receptionist> registerReceptionist(@RequestBody Receptionist receptionist) {
        Receptionist registeredReceptionist = (Receptionist) userService.registerUser(receptionist);
        return new ResponseEntity<>(registeredReceptionist, HttpStatus.CREATED);
    }



    // Step 1: validate username/password and send OTP
    @PostMapping("/api/user/login")
    public ResponseEntity<?> loginAndSendOtp(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            // Generate & email OTP
            otpService.createAndSendOtpForUser(user.getUsername());
            // Return a response saying OTP sent (do NOT return token yet)
            return ResponseEntity.ok().body(
                java.util.Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "message", "OTP_SENT"
                )
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message","INVALID_CREDENTIALS"));
        }
    }

    // Step 2: verify OTP and return token on success
    @PostMapping("/api/user/verify-otp")
    public ResponseEntity<?> verifyOtpAndLogin(@RequestBody java.util.Map<String, String> body) {
        String username = body.get("username");
        String otp = body.get("otp");
        if (username == null || otp == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message","MISSING_PARAMS"));
        }
        boolean ok = otpService.verifyOtp(username, otp);
        if (ok) {
            String token = jwtUtil.generateToken(username);
            User user = userService.getUserByUsername(username);
            LoginResponse response = new LoginResponse(user.getId(), token, user.getUsername(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message","INVALID_OR_EXPIRED_OTP"));
        }
    }

    // Resend OTP (server enforces cooldown)
    @PostMapping("/api/user/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody java.util.Map<String, String> body) {
        String username = body.get("username");
        if (username == null) return ResponseEntity.badRequest().body(java.util.Map.of("message","MISSING_USERNAME"));
        try {
            if (!otpService.canResend(username)) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(java.util.Map.of("message","RESEND_COOLDOWN"));
            }
            otpService.resendOtp(username);
            return ResponseEntity.ok(java.util.Map.of("message","OTP_RESENT"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("message","ERROR", "detail", ex.getMessage()));
        }
    }

}