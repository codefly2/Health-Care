package com.wecp.healthcare_appointment_management_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .antMatchers(
                    "/api/user/login",
                    "/api/patient/register",
                    "/api/doctors/register",
                    "/api/receptionist/register"
                ).permitAll()
                .antMatchers("/api/patient/**").hasAuthority("PATIENT")
                .antMatchers("/api/doctor/**").hasAuthority("DOCTOR")
                .antMatchers("/api/receptionist/**").hasAuthority("RECEPTIONIST")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
