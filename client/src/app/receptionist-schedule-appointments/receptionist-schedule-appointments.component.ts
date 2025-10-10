import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';
import { of, map } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-receptionist-schedule-appointments',
  templateUrl: './receptionist-schedule-appointments.component.html',
  styleUrls: ['./receptionist-schedule-appointments.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ]
})
export class ReceptionistScheduleAppointmentsComponent implements OnInit {

  itemForm: FormGroup;
  formModel: any = {};
  responseMessage: any;
  isAdded: boolean = false;
  minDateTime!: string;

  filteredAppointments$: any;
  appointmentList$: any;
  doctorList: any = [];

  // 👇 This will hold only unique patients
  uniqueAppointments$: any;

  constructor(
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.itemForm = this.formBuilder.group({
      patientId: [this.formModel.patientId, [Validators.required]],
      doctorId: [this.formModel.doctorId, [Validators.required]],
      time: [this.formModel.time, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAppointments();
    this.getPatients();
    this.minDateTime = new Date().toISOString().slice(0, 16);
  }

  onSubmit() {
    const formattedTime = this.datePipe.transform(
      this.itemForm.controls['time'].value,
      'yyyy-MM-dd HH:mm:ss'
    );
    this.itemForm.controls['time'].setValue(formattedTime);

    this.httpService.ScheduleAppointmentByReceptionist(this.itemForm.value)
      .subscribe(() => {
        this.itemForm.reset();
        this.responseMessage = "Appointment saved successfully";
        this.getPatients();
        this.isAdded = false;
      });
  }

  getAppointments() {
    this.httpService.getAllAppointments().subscribe((data:any) => {
      this.appointmentList$ = of(data);
      this.filteredAppointments$ = of(data);

      // 👇 Filter unique patients by ID and store separately
      const uniqueList = data.filter((item: any, index: number, self: any[]) =>
        index === self.findIndex((t) => t.patient.id === item.patient.id)
      );

      // Store as observable so it works easily with async pipe in HTML
      this.uniqueAppointments$ = of(uniqueList);
    });
  }

  getPatients() {
    this.httpService.getDoctors().subscribe((data) => {
      this.doctorList = data;
    });
  }
}