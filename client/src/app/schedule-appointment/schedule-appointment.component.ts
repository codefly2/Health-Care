import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
  providers: [DatePipe]
})
export class ScheduleAppointmentComponent implements OnInit {
  itemForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // ✅ Create form with required fields
    this.itemForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  // 🔹 Getter for form controls
  get f() {
    return this.itemForm.controls;
  }

  // 🔹 Submit form and call API
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    const formValue = this.itemForm.value;

    const appointmentDetails = {
      patientId: formValue.patientId,
      doctorId: formValue.doctorId,
      time: this.datePipe.transform(formValue.time, 'yyyy-MM-ddTHH:mm:ss')
    };

    this.httpService.ScheduleAppointment(appointmentDetails).subscribe({
      next: (res) => {
        this.successMessage = 'Appointment scheduled successfully';
        this.errorMessage = '';
        console.log('API Response:', res);
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = 'Error scheduling appointment';
        console.error('Error:', err);
      }
    });
  }
}