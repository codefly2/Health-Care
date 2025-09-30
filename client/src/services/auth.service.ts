import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isLoggedIn: boolean = false;
  id: string | null | undefined;

  private apiUrl = 'http://localhost:3000/api/auth'; // 🔹 Replace with your backend endpoint

  constructor(private http: HttpClient) {}

  // Login method that calls backend API
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      username,
      password
    });
  }

  // Method to save token received from login
  saveToken(token: string) {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  SetRole(role: any) {
    localStorage.setItem('role', role);
  }

  get getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Method to retrieve login status
  get getLoginStatus(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.token = null;
    this.isLoggedIn = false;
  }

  saveUserId(userid: string) {
    localStorage.setItem('userId', userid);
  }
}