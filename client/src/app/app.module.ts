import { ApplicationInitStatus, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<<<<<<< HEAD

=======
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { PatientAppointmentComponent } from './patient-appointment/patient-appointment.component';

import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment.component';

import { DoctorAppointmentComponent } from './doctor-appointment/doctor-appointment.component';
import { DoctorAvailabilityComponent } from './doctor-availability/doctor-availability.component';
import { ReceptionistAppointmentsComponent } from './receptionist-appointments/receptionist-appointments.component';
import { ReceptionistScheduleAppointmentsComponent } from './receptionist-schedule-appointments/receptionist-schedule-appointments.component';
<<<<<<< HEAD
=======
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';

>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashbaordComponent,
    PatientAppointmentComponent,
    ScheduleAppointmentComponent,
    DoctorAvailabilityComponent,
    DoctorAppointmentComponent,
    ReceptionistAppointmentsComponent,
<<<<<<< HEAD
    ReceptionistScheduleAppointmentsComponent
=======
    ReceptionistScheduleAppointmentsComponent,
    LandingComponent,
    AboutComponent,

>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90

    
  ],
  imports: [
<<<<<<< HEAD
=======
    BrowserAnimationsModule,
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [HttpService, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}