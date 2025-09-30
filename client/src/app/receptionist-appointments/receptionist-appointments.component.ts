import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-receptionist-appointments',
  templateUrl: './receptionist-appointments.component.html',
  styleUrls: ['./receptionist-appointments.component.scss'],
  providers: [DatePipe]
})
export class ReceptionistAppointmentsComponent implements OnInit {

  itemForm!: FormGroup;
  appointments: any[] = []; // Holds appointment data

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      id: ['', Validators.required], // patientId or appointmentId
      time: ['', Validators.required], // appointment time
    });

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.httpService.getAllAppointments().subscribe({
      next: (data) => (this.appointments = data),
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  submitForm(): void {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      const details = {
        patientId: formValue.id,
        doctorId: formValue.doctorId,
        time: this.datePipe.transform(formValue.time, 'yyyy-MM-ddTHH:mm:ss')
      };

      this.httpService.ScheduleAppointmentByReceptionist(details).subscribe({
        next: (res) => {
          console.log('Appointment scheduled', res);
          this.loadAppointments(); // Refresh list
        },
        error: (err) => console.error('Error scheduling appointment', err)
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}