import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements AfterViewInit ,OnInit{
 
   // BMI Calculator properties
   height: number | null = null;
   weight: number | null = null;
   bmiResult: number | null = null;
   bmiCategory: string = '';
   public appointmentsChart: Chart | undefined;
 
  // Data populated from HttpService
  todaysAppointments: any[] = [];
 
  // Footer stats; initialize with default but update from data
  stats = { patientsToday: 0, appointmentsBooked: 0, newRegistrations: 0 };
  roleName: string | null;
 
  constructor(private httpService: HttpService,private authService: AuthService, private router: Router) {
    this.roleName = this.authService.getRole;
  }
 
  ngOnInit(): void {
      this.loadAppointmentData();
   
  }
  ngOnDestroy(): void {
    // Destroy the chart instance to prevent memory leaks
    if (this.appointmentsChart) {
      this.appointmentsChart.destroy();
    }
  }
  ngAfterViewInit(): void {
    this.fetchDashboardData();
  }
 
  fetchDashboardData() {
    this.httpService.getReceptionistDashboardData().subscribe((data: any[]) => {
      // Adapt API data to component format
      this.todaysAppointments = data.map(appt => ({
        time: appt.appointmentTime,
        patient: {
          name: appt.patientName,
          avatar: appt.patientAvatar || 'https://i.pravatar.cc/40?u=' + encodeURIComponent(appt.patientName)
        },
        doctor: {
          name: appt.doctorName,
          department: appt.doctorDepartment,
          action: appt.action // only if API provides this
        },
        status: appt.status
      }));
 
      // Footer stats (example: aggregate from response)
      this.stats.patientsToday = data.length;
      this.stats.appointmentsBooked = data.length;
      this.stats.newRegistrations = (data.filter(appt => appt.isNewRegistration).length) || Math.floor(Math.random() * 10); // fallback
 
      // Prepare chart data and render
      setTimeout(() => {
        this.loadBarChart();
        this.loadDoughnutChart();
      });
    });
  }
 
  loadBarChart() {
    // Your existing data logic...
    const hourBuckets: { [hour: number]: number } = {};
 
    this.todaysAppointments.forEach(appt => {
      console.log(appt.time);
      const d = new Date(appt.time);
      console.log(d);
      const hour = d.getUTCHours();
      console.log(hour);
      hourBuckets[hour] = (hourBuckets[hour] || 0) + 1;
    });
    const hours = Object.keys(hourBuckets).sort((a, b) => +a - +b);
    const data = hours.map(h => hourBuckets[+h]);
    const labels = hours.map(h => h + ':00');
 
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Check-ins',
          data: data,
          backgroundColor: '#42A5F5',
          borderRadius: 6,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { display: false },
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
 
  confirmedPercent = 0;
  rescheduledPercent = 0;
 
  loadDoughnutChart() {
    // Calculate status counts from appointments
    const confirmedCount = this.todaysAppointments.filter(appt => appt.status === 'Scheduled').length;
    const rescheduledCount = this.todaysAppointments.filter(appt => appt.status === 'Cancelled' || appt.status === 'Rescheduled').length;
    const total = confirmedCount + rescheduledCount;
 
    this.confirmedPercent = total > 0 ? Math.round((confirmedCount / total) * 100) : 0;
    this.rescheduledPercent = total > 0 ? Math.round((rescheduledCount / total) * 100) : 0;
    const confirmedPercentage = total > 0 ? Math.round((confirmedCount / total) * 100) : 0;
 
    // Custom plugin for center text
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart: Chart) => {
        const ctx = chart.ctx;
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
 
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
 
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#0D6EFD';
        ctx.fillText(`${confirmedPercentage}%`, centerX, centerY - 10);
 
        ctx.font = '14px Arial';
        ctx.fillStyle = '#6c757d';
        ctx.fillText('Confirmed', centerX, centerY + 20);
        ctx.restore();
      }
    };
 
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Rescheduled'],
        datasets: [{
          data: [confirmedCount, rescheduledCount],
          backgroundColor: ['#0D6EFD', '#E0E0E0'],
          borderColor: ['#FFFFFF'],
          borderWidth: 4,
          borderRadius: 16
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // cutout: '80%',
        plugins: { legend: { display: false } }
      },
      plugins: [centerTextPlugin]
    });
  }
 
//doctor
 
loadAppointmentData(): void {
  // CORRECTED: Retrieve patient ID directly from localStorage as per your AuthService
  const patientId = localStorage.getItem('userId');
 
  if (!patientId) {
    console.error("Patient ID not found in localStorage.");
    // You could display an error message or use sample data
    const sampleLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const sampleData = [0, 0, 0, 0, 0, 0]; // Show empty chart if no user
    this.createChart(sampleLabels, sampleData);
    return;
  }
 
  this.httpService.getAppointmentByPatient(patientId).subscribe({
    next: (appointments: any[]) => {
      const { labels, data } = this.processAppointmentData(appointments);
      this.createChart(labels, data);
    },
    error: (err) => {
      console.error("Failed to fetch appointments", err);
      // Fallback to sample data on API error
      const sampleLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const sampleData = [3, 5, 2, 6, 4, 7, 5]; // Sample data for demonstration
      this.createChart(sampleLabels, sampleData);
    }
  });
}
 
processAppointmentData(appointments: any[]): { labels: string[], data: number[] } {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyCounts = Array(12).fill(0);
 
  appointments.forEach(app => {
    // Assuming your appointment object has a date property like 'appointmentDate'
    const appDate = new Date(app.appointmentDate);
    const month = appDate.getMonth(); // 0-11
    if (month >= 0 && month < 12) {
      monthlyCounts[month]++;
    }
  });
 
  // We will show the first 7 months for a consistent look
  return {
      labels: monthNames.slice(0, 7),
      data: monthlyCounts.slice(0, 7)
  };
}
 
createChart(labels: string[], data: number[]): void {
  if (this.appointmentsChart) {
    this.appointmentsChart.destroy();
  }
 
  this.appointmentsChart = new Chart('appointmentsChart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Appointments',
        data: data,
        backgroundColor: 'rgba(44, 103, 242, 0.8)',
        borderColor: 'rgba(44, 103, 242, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#e9ecef' } },
        x: { grid: { display: false } }
      }
    }
  });
}
 
calculateBmi(): void {
  if (this.height && this.weight && this.height > 0 && this.weight > 0) {
    const heightInMeters = this.height / 100;
    const bmi = this.weight / (heightInMeters * heightInMeters);
    this.bmiResult = bmi;
 
    if (bmi < 18.5) {
      this.bmiCategory = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      this.bmiCategory = 'Normal Weight';
    } else if (bmi >= 25 && bmi < 29.9) {
      this.bmiCategory = 'Overweight';
    } else {
      this.bmiCategory = 'Obese';
    }
  } else {
    this.bmiResult = null;
    this.bmiCategory = '';
  }
}
 
getBmiResultClass(): string {
  if (!this.bmiCategory) return '';
 
  switch (this.bmiCategory) {
    case 'Underweight': return 'bmi-underweight';
    case 'Normal Weight': return 'bmi-normal';
    case 'Overweight': return 'bmi-overweight';
    case 'Obese': return 'bmi-obese';
    default: return '';
  }
}
 
 
}