import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName=environment.apiUrl;
  mystring!:any;
  constructor(private http: HttpClient, private authService:AuthService) {}
  getDashboardData(): Observable<any> {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.get(`${this.serverName}/api/dashboard-data`, { headers });
  }

  updateDoctorAvailability(doctorId:any,availability:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/doctor/availability?doctorId='+doctorId+'&availability='+availability,{},{headers:headers});
  }

  getAllAppointments()
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.get(this.serverName+'/api/receptionist/appointments',{headers:headers});
  }


  getAppointmentByDoctor(id:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);   
    return this.http.get(this.serverName+'/api/doctor/appointments?doctorId='+id,{headers:headers});
  
  }
  getAppointmentByPatient(id:any)
  {
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);   
    return this.http.get(this.serverName+'/api/patient/appointments?patientId='+id,{headers:headers});
  
  }
  ScheduleAppointment( details:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/patient/appointment?patientId='+details.patientId+'&doctorId='+details.doctorId,details,{headers:headers});
  }
  ScheduleAppointmentByReceptionist( details:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.post(this.serverName+'/api/receptionist/appointment?patientId='+details.patientId+'&doctorId='+details.doctorId,details,{headers:headers});
  }
  reScheduleAppointment( appointmentId:any,formvalue:any):Observable<any> {  
    debugger;
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);
    return this.http.put(this.serverName+'/api/receptionist/appointment-reschedule/'+appointmentId,formvalue,{headers:headers});
  }
  
  getDoctors():Observable<any> {
   
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`)
    return this.http.get(this.serverName+`/api/patient/doctors`,{headers:headers});
  }

  // --- OTP RELATED METHODS ---

  // Modified Login method to reflect OTP flow.
  // This method should trigger OTP generation if 2FA is enabled.
  Login(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    // Assuming your backend's login endpoint handles sending OTP
    // and returns a response indicating if OTP was sent.
    return this.http.post(this.serverName+'/api/user/login',details,{headers:headers});
  }

  // New method to verify the OTP entered by the user
  VerifyOtp(otpData: { username: string; otp: string }): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    // Assuming your backend has an endpoint like '/api/user/verify-otp'
    return this.http.post(this.serverName+'/api/user/verify-otp', otpData, {headers:headers});
  }

  // New method to request a new OTP be sent
  ResendOtp(requestData: { username: string }): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    // Assuming your backend has an endpoint like '/api/user/resend-otp'
    return this.http.post(this.serverName+'/api/user/resend-otp', requestData, {headers:headers});
  }

  // --- END OTP RELATED METHODS ---

  registerPatient(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/patient/register',details,{headers:headers});
  }
  registerDoctors(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/doctors/register',details,{headers:headers});
  }
  registerReceptionist(details:any):Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverName+'/api/receptionist/register',details,{headers:headers});
  }

  usernameExists(username: string): Observable<boolean> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.get<boolean>(this.serverName + '/api/user/exists', { headers: headers, params: { username } });
  }

  deleteAppointment(val:any):Observable<any>{ // Changed to return Observable<any> for consistency with other methods
    console.log("Helloooo"+val);
    const authToken = this.authService.getToken();  
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Bearer ${authToken}`);   
    return this.http.delete(this.serverName+'/api/appointment/delete?appointmentId='+val,{headers:headers});
  }

}