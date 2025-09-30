import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  serverName = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  registerPatient(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/patient/register`, details, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  registerDoctors(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/doctors/register`, details, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  registerReceptionist(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/receptionist/register`, details, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.serverName}/api/patient/doctors`, {
      headers: this.getAuthHeaders(),
    });
  }

  ScheduleAppointment(details: any): Observable<any> {
    const { patientId, doctorId } = details;
    return this.http.post(
      `${this.serverName}/api/patient/appointment?patientId=${patientId}&doctorId=${doctorId}`,
      details,
      { headers: this.getAuthHeaders() }
    );
  }

  ScheduleAppointmentByReceptionist(details: any): Observable<any> {
    const { patientId, doctorId } = details;
    return this.http.post(
      `${this.serverName}/api/receptionist/appointment?patientId=${patientId}&doctorId=${doctorId}`,
      details,
      { headers: this.getAuthHeaders() }
    );
  }

  reScheduleAppointment(appointmentId: number, formvalue: any): Observable<any> {
    return this.http.put(
      `${this.serverName}/api/receptionist/appointment-reschedule/${appointmentId}`,
      formvalue,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllAppointments(): Observable<any> {
    return this.http.get(`${this.serverName}/api/receptionist/appointments`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAppointmentByDoctor(doctorId: number): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/doctor/appointments?doctorId=${doctorId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAppointmentByPatient(patientId: number|null): Observable<any> {
    return this.http.get(
      `${this.serverName}/api/patient/appointments?patientId=${patientId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateDoctorAvailability(doctorId: number, availability: string): Observable<any> {
    return this.http.post(
      `${this.serverName}/api/doctor/availability?doctorId=${doctorId}&availability=${availability}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  Login(loginDetails: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, loginDetails, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}