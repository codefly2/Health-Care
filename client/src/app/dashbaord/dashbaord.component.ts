import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  roleName: string | null = localStorage.getItem('role');
  dashboardData: any = {};
  isLoading = true;

  // Chart data
  appointmentsChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  availabilityChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: false }
    }
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.httpService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res;

        // Weekly Appointments chart
        if (res.weeklyAppointments?.length) {
          this.appointmentsChartData = {
            labels: res.weeklyAppointments.map((d: any) => d.day),
            datasets: [
              {
                label: 'Appointments per Day',
                data: res.weeklyAppointments.map((d: any) => d.count),
                backgroundColor: '#4FD1C5'
              }
            ]
          };
        }

        // Doctor Availability chart
        if (res.doctorAvailability?.length) {
          this.availabilityChartData = {
            labels: res.doctorAvailability.map((d: any) => d.name),
            datasets: [
              {
                label: 'Available Hours',
                data: res.doctorAvailability.map((d: any) => d.availableHours),
                backgroundColor: '#38B2AC'
              }
            ]
          };
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard data error:', err);
        this.isLoading = false;
      }
    });
  }
}
