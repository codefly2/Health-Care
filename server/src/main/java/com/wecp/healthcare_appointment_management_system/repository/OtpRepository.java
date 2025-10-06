package com.wecp.healthcare_appointment_management_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wecp.healthcare_appointment_management_system.entity.Otp;

@Repository
public interface OtpRepository extends JpaRepository<Otp,Long>{
    Optional<Otp> findTopByUsernameOrderByCreatedAtDesc(String username);
    void deleteByUsername(String username);
}
