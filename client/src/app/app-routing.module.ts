import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AppComponent } from './app.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { PatientAppointmentComponent } from './patient-appointment/patient-appointment.component';
import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment.component';
import { DoctorAppointmentComponent } from './doctor-appointment/doctor-appointment.component';
import { DoctorAvailabilityComponent } from './doctor-availability/doctor-availability.component';
import { ReceptionistAppointmentsComponent } from './receptionist-appointments/receptionist-appointments.component';
import { ReceptionistScheduleAppointmentsComponent } from './receptionist-schedule-appointments/receptionist-schedule-appointments.component';
<<<<<<< HEAD
import { LandingPageComponent } from './landing/landing';
=======
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90




const routes: Routes = [
<<<<<<< HEAD






  { path: 'landing', component: LandingPageComponent },
  { path: '', redirectTo:'/landing', pathMatch:'full' },
=======
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashbaordComponent }, 
  { path: 'patient-appointment', component: PatientAppointmentComponent }, 
  { path: 'schedule-appointment', component: ScheduleAppointmentComponent }, 
  { path: 'doctor-appointment', component: DoctorAppointmentComponent }, 
  { path: 'doctor-availability', component: DoctorAvailabilityComponent },
  { path: 'receptionist-appointments', component: ReceptionistAppointmentsComponent },
  { path: 'receptionist-schedule-appointments', component: ReceptionistScheduleAppointmentsComponent },
<<<<<<< HEAD
  
  
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
=======
  { path: 'landing', component: LandingComponent },
    { path: 'about', component: AboutComponent },
  
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}