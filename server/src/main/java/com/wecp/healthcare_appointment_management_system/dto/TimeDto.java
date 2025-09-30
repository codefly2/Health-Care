package com.wecp.healthcare_appointment_management_system.dto;

import java.util.Date;

public class TimeDto {

    private Date appointmentTime;

    public TimeDto() {}

    public TimeDto(Date appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Date getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(Date appointmentTime) { this.appointmentTime = appointmentTime; }
}