import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Subscription, interval } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-doctor-availability',
  templateUrl: './doctor-availability.component.html',
  styleUrls: ['./doctor-availability.component.scss']
})
export class DoctorAvailabilityComponent implements OnInit, AfterViewInit, OnDestroy {
  itemForm: FormGroup;
  responseMessage: string | null = null;
  isSaving: boolean = false;

  // Data
  appointments: any[] = [];
  stats = {
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  };

  // charts
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  statusChart?: Chart;
  trendChart?: Chart;

  // polling
  private subs = new Subscription();
  private pollIntervalMs = 15000; // 15s

  // UI
  loading: boolean = false;

  constructor(public httpService: HttpService, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      doctorId: [null, Validators.required],
      availability: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;
    if (userId) {
      this.itemForm.controls['doctorId'].setValue(userId);
    }

    // initial load
    this.loadAppointments();

    // poll for updates
    const poll$ = interval(this.pollIntervalMs);
    this.subs.add(
      poll$.subscribe(() => {
        this.loadAppointments(true); // silent reload
      })
    );
  }

  ngAfterViewInit(): void {
    // create placeholder charts (will update after data loads)
    this.createStatusChart();
    this.createTrendChart();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.statusChart?.destroy();
    this.trendChart?.destroy();
  }

  // Fetch appointments for this doctor and recompute stats/charts
  loadAppointments(silent: boolean = false) {
    if (!silent) {
      this.loading = true;
    }
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.subs.add(
      this.httpService.getAppointmentByDoctor(userId).subscribe({
        next: (data: any) => {
          // support array or {appointments: []}
          this.appointments = Array.isArray(data) ? data : (data?.appointments || []);
          // normalize date/time - ensure appointmentTime exists as ISO date for pipes
          this.appointments = this.appointments.map(a => this.normalizeAppointment(a));
          this.calculateStats();
          this.updateStatusChart();
          this.updateTrendChart();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load appointments', err);
          this.loading = false;
        }
      })
    );
  }

  normalizeAppointment(a: any) {
    const copy = { ...a };
    // Accept many shapes: appointmentTime, datetime, date + time, dateTime
    if (!copy.appointmentTime) {
      const combined = copy.datetime || copy.dateTime || copy.scheduledAt || copy.scheduledOn;
      if (combined) {
        copy.appointmentTime = combined;
      } else if (copy.date && copy.time) {
        copy.appointmentTime = `${copy.date}T${copy.time}`;
      } else if (typeof copy.date === 'number') {
        copy.appointmentTime = new Date(copy.date).toISOString();
      }
    }
    return copy;
  }

  calculateStats() {
    const total = this.appointments.length;
    const confirmed = this.appointments.filter(a => (a.status || '').toLowerCase() === 'confirmed').length;
    const pending = this.appointments.filter(a => (a.status || '').toLowerCase() === 'pending').length;
    const cancelled = this.appointments.filter(a => (a.status || '').toLowerCase() === 'cancelled').length;
    this.stats = { total, confirmed, pending, cancelled };
  }

  onSubmit() {
    if (this.itemForm.invalid) return;
    this.isSaving = true;
    this.responseMessage = null;
    const doctorId = this.itemForm.controls['doctorId'].value;
    const availability = this.itemForm.controls['availability'].value;

    this.subs.add(
      this.httpService.updateDoctorAvailability(doctorId, availability).subscribe({
        next: (res) => {
          this.responseMessage = '✅ Availability updated successfully';
          this.isSaving = false;
          // reload appointments (availability might not change appointments but refresh)
          this.loadAppointments(true);
          setTimeout(() => (this.responseMessage = null), 3500);
        },
        error: (err) => {
          console.error('Update availability error', err);
          this.responseMessage = '⚠️ Could not update availability';
          this.isSaving = false;
          setTimeout(() => (this.responseMessage = null), 3500);
        }
      })
    );
  }

  // Chart helpers
  createStatusChart() {
    const ctx = this.statusChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Confirmed', 'Pending', 'Cancelled'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    };
    this.statusChart = new Chart(ctx, config);
  }

  updateStatusChart() {
    if (!this.statusChart) return;
    this.statusChart.data.datasets![0].data = [
      this.stats.confirmed,
      this.stats.pending,
      this.stats.cancelled
    ];
    this.statusChart.update();
  }

  createTrendChart() {
    const ctx = this.trendChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [], // dates
        datasets: [{
          label: 'Appointments',
          data: [],
          borderColor: '#0d6efd',
          backgroundColor: (ctx as any).createLinearGradient(0, 0, 0, 200) as any,
          fill: true,
          tension: 0.35,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      },
    };
    // set gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, 'rgba(13,110,253,0.18)');
    grad.addColorStop(1, 'rgba(13,110,253,0.02)');
    (config.data.datasets![0] as any).backgroundColor = grad;
    this.trendChart = new Chart(ctx, config);
  }

  updateTrendChart() {
    if (!this.trendChart) return;
    // create a count per day for next 14 days or last 14 days depending on data
    // We'll show upcoming 14 days counts (based on appointmentTime)
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const key = d.toISOString().split('T')[0];
      map.set(key, 0);
    }
    this.appointments.forEach(a => {
      if (!a.appointmentTime) return;
      const dt = new Date(a.appointmentTime);
      if (isNaN(dt.getTime())) return;
      const key = dt.toISOString().split('T')[0];
      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    const labels = Array.from(map.keys());
    const data = Array.from(map.values());
    this.trendChart.data.labels = labels;
    (this.trendChart.data.datasets![0].data as number[]) = data;
    this.trendChart.update();
  }

  // utility for UI display
  displayDate(appt: any) {
    try {
      if (!appt?.appointmentTime) return '—';
      const dt = new Date(appt.appointmentTime);
      return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return appt?.date || '—';
    }
  }

  displayTime(appt: any) {
    try {
      if (!appt?.appointmentTime) return '—';
      const dt = new Date(appt.appointmentTime);
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return appt?.time || '—';
    }
  }

}