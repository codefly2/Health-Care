package com.wecp.healthcare_appointment_management_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${mail.from:#{null}}")
    private String fromAddress;
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    public void sendSimpleMessage(String to,String subject,String text){
        SimpleMailMessage message = new SimpleMailMessage();
        if(fromAddress != null) message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
