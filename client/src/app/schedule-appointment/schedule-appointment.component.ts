import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
  providers: [DatePipe]
})
export class ScheduleAppointmentComponent implements OnInit {
  doctorList: any=[];
  itemForm: FormGroup;
  formModel:any={};
  responseMessage:any;
  isAdded: boolean=false;
  doctorChart: any;
  specialityChart: any;
  minDateTime!: string;

  constructor(
    public httpService:HttpService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.itemForm = this.formBuilder.group({
      patientId: [this.formModel.patientId,[ Validators.required]],
      doctorId: [this.formModel.doctorId,[ Validators.required]],
      time: [this.formModel.time,[ Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getPatients();
    this.minDateTime = new Date().toISOString().slice(0, 16);
  }

  getPatients() {
    this.httpService.getDoctors().subscribe((data)=>{
      this.doctorList=data;
      this.renderChart();
    })
  }

  renderChart() {
    const available = this.doctorList.filter((d:any)=> d.availability === 'Yes').length;
    const notAvailable = this.doctorList.length - available;
    // Doctor Availability Chart (now a pie chart)
    if(this.doctorChart) this.doctorChart.destroy();
    this.doctorChart = new Chart('doctorChart', {
      type: 'pie',
      data: {
        labels: ['Available', 'Not Available'],
        datasets: [{
          data: [available, notAvailable],
          backgroundColor: ['#4f6ef7', '#f76e6e'],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    // Speciality Distribution Chart
    const specialityCounts: {[key:string]:number} = {};
    this.doctorList.forEach((d:any)=>{
      specialityCounts[d.specialty] = (specialityCounts[d.specialty] || 0) + 1;
    });
    const labels = Object.keys(specialityCounts);
    const values = Object.values(specialityCounts);
    const colors = ['#4f6ef7', '#5f95f7', '#f7a64f', '#4ff7ae', '#f76e6e', '#9b59b6'];
    if(this.specialityChart) this.specialityChart.destroy();
    this.specialityChart = new Chart('specialityChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  addAppointment(val:any) {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;
    this.itemForm.controls["doctorId"].setValue(val.id);
    this.itemForm.controls["patientId"].setValue(userId);
    this.isAdded=true;
  }

  onSubmit() {
    const formattedTime = this.datePipe.transform(this.itemForm.controls['time'].value, 'yyyy-MM-dd HH:mm:ss');
    this.itemForm.controls['time'].setValue(formattedTime);
    this.httpService.ScheduleAppointment(this.itemForm.value).subscribe(()=>{
      this.itemForm.reset();
      this.responseMessage="Appointment saved successfully";
      this.isAdded=false;
      this.getPatients(); // refresh chart
    })
  }
}