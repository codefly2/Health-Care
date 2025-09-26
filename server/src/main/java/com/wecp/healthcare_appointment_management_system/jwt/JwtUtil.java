package com.wecp.healthcare_appointment_management_system.jwt;

import com.wecp.healthcare_appointment_management_system.entity.User;
import com.wecp.healthcare_appointment_management_system.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class JwtUtil {

}