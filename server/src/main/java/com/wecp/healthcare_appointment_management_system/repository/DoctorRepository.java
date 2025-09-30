package com.wecp.healthcare_appointment_management_system.repository;

import com.wecp.healthcare_appointment_management_system.entity.Doctor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findAllByOrderByIdAsc();
}
