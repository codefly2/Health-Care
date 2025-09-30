import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      username: ['', Validators.required],
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
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      console.log('Form submitted:', formData);
    } else {
      console.log('Form is invalid');
    }
  }
}