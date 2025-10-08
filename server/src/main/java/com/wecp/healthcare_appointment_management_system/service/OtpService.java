package com.wecp.healthcare_appointment_management_system.service;

import com.wecp.healthcare_appointment_management_system.entity.Otp;
import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.repository.OtpRepository;
import com.wecp.healthcare_appointment_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Value("${otp.expiry.seconds:300}")
    private long otpExpirySeconds;

    @Value("${otp.resend.cooldown.seconds:30}")
    private long resendCooldownSeconds;

    public OtpService(OtpRepository otpRepository, EmailService emailService, UserRepository userRepository) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    private String generateOtpCode() {
        Random rnd = new Random();
        int number = 100000 + rnd.nextInt(900000); // 6-digit
        return String.valueOf(number);
    }

    public void createAndSendOtpForUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null || user.getEmail() == null) {
            throw new RuntimeException("User or email not found");
        }

        // Create OTP
        String code = generateOtpCode();
        Instant now = Instant.now();
        Otp otp = new Otp();
        otp.setUsername(username);
        otp.setCode(code);
        otp.setCreatedAt(now);
        otp.setExpiresAt(now.plusSeconds(otpExpirySeconds));
        otp.setLastSentAt(now);
        otp.setUsed(false);
        otpRepository.save(otp);

        // send email
        String subject = "Your login OTP";
        String text = "Your OTP for login is: " + code + "\nIt is valid for " + (otpExpirySeconds/60) + " minutes.";
        emailService.sendSimpleMessage(user.getEmail(), subject, text);
    }

    public boolean canResend(String username) {
        Optional<Otp> o = otpRepository.findTopByUsernameOrderByCreatedAtDesc(username);
        if (o.isEmpty()) return true;
        Otp otp = o.get();
        Instant last = otp.getLastSentAt();
        if (last == null) return true;
        return Instant.now().isAfter(last.plusSeconds(resendCooldownSeconds));
    }

    public void resendOtp(String username) {
        Optional<Otp> o = otpRepository.findTopByUsernameOrderByCreatedAtDesc(username);
        if (o.isEmpty()) {
            createAndSendOtpForUser(username);
            return;
        }
        Otp otp = o.get();
        // only resend if cooldown passed
        if (!canResend(username)) {
            throw new RuntimeException("Resend cooldown not passed");
        }

        // generate a new code (better security) and update timestamps
        String code = generateOtpCode();
        Instant now = Instant.now();
        otp.setCode(code);
        otp.setCreatedAt(now);
        otp.setExpiresAt(now.plusSeconds(otpExpirySeconds));
        otp.setLastSentAt(now);
        otp.setUsed(false);
        otpRepository.save(otp);

        User user = userRepository.findByUsername(username);
        if (user == null) throw new RuntimeException("User not found");
        String subject = "Your login OTP (resend)";
        String text = "Your OTP for login is: " + code + "\nIt is valid for " + (otpExpirySeconds/60) + " minutes.";
        emailService.sendSimpleMessage(user.getEmail(), subject, text);
    }

    public boolean verifyOtp(String username, String code) {
        Optional<Otp> o = otpRepository.findTopByUsernameOrderByCreatedAtDesc(username);
        if (o.isEmpty()) return false;
        Otp otp = o.get();
        if (otp.isUsed()) return false;
        if (otp.getExpiresAt() == null || Instant.now().isAfter(otp.getExpiresAt())) return false;
        if (!otp.getCode().equals(code)) return false;

        otp.setUsed(true);
        otpRepository.save(otp);
        return true;
    }
}
