import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  message: string = '';
  errorMessage: string = '';

  private baseUrl = 'http://localhost:5000/api'; // ✅ your Spring Boot backend

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      specialty: [''],
      availability: ['']
    });

    this.onRoleChange();
  }

  onRoleChange(): void {
    this.itemForm.get('role')?.valueChanges.subscribe(role => {
      const specialtyControl = this.itemForm.get('specialty');
      const availabilityControl = this.itemForm.get('availability');

      if (role === 'DOCTOR') {
        specialtyControl?.setValidators([Validators.required]);
        availabilityControl?.setValidators([Validators.required]);
      } else {
        specialtyControl?.clearValidators();
        availabilityControl?.clearValidators();
      }

      specialtyControl?.updateValueAndValidity();
      availabilityControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    const formData = this.itemForm.value;
    let endpoint = '';

    switch (formData.role) {
      case 'PATIENT':
        endpoint = `${this.baseUrl}/patient/register`;
        break;
      case 'DOCTOR':
        endpoint = `${this.baseUrl}/doctors/register`;
        break;
      case 'RECEPTIONIST':
        endpoint = `${this.baseUrl}/receptionist/register`;
        break;
      default:
        this.errorMessage = 'Invalid role selected';
        return;
    }

    this.http.post(endpoint, formData).subscribe({
      next: (res) => {
        this.message = `${formData.role} registered successfully!`;
        this.errorMessage = '';
        this.itemForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Registration failed. Please try again.';
        this.message = '';
      }
    });
  }
}
