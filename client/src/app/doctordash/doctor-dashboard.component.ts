import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../environments/environment.development';

Chart.register(...registerables);

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit, AfterViewInit {
  doctorName: string = 'Good morning Doc 👋';
  doctorId!: number;

  totalPatients = 0;
  patientPerDayData: number[] = [];
  dates: string[] = [];
  dashboardChart: any;

  // 🩵 Tasks + Notepad
  tasks: { text: string; done: boolean }[] = [];
  newTask = '';
  notes = '';

  // 🩵 News
  newsFeed: any[] = [];
  expandedIndex: number | null = null;
  isNewsLoading = false;

  currentTime = new Date();

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    this.doctorId = userIdString ? parseInt(userIdString, 10) : 1;

    this.loadDoctorProfile();
    // this.loadDashboardData();
    this.loadAppointments();
    this.loadNews(false);
    this.loadTasks();
    this.loadNotes();

    setInterval(() => (this.currentTime = new Date()), 30000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.renderChart(), 500);
  }

  // ---- Get Doctor Details ----
  loadDoctorProfile() {
    this.httpService.getDoctorProfile(this.doctorId).subscribe({
      next: (res: any) => {
        if (res && res.username) {
          this.doctorName = `Dr. ${res.username}`;
        } else {
          this.doctorName = 'Good morning Doc 👋';
        }
      },
      error: () => {
        this.doctorName = 'Good morning Doc 👋';
      }
    });
  }
  // ---- Appointments ----
  loadAppointments() {
    this.httpService.getAppointmentByDoctor(this.doctorId).subscribe({
      next: (res: any) => {
        if (!Array.isArray(res)) return;
        const dailyMap: { [key: string]: number } = {};
        res.forEach((a: any) => {
          const day = (a.date || a.appointmentDate || '').slice(0, 10);
          if (!day) return;
          dailyMap[day] = (dailyMap[day] || 0) + 1;
        });
        this.dates = Object.keys(dailyMap).slice(-5);
        this.patientPerDayData = Object.values(dailyMap).slice(-5);
        this.renderChart();
      },
      error: () => {
        this.dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        this.patientPerDayData = [10, 14, 9, 11, 7];
        this.renderChart();
      }
    });
  }
  public serverName=environment.apiUrl;
  loadNews(forceRefresh: boolean = false) {
    this.isNewsLoading = true;
    const cacheKey = 'newsCache';
    const cached = localStorage.getItem(cacheKey);
  
    if (!forceRefresh && cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
        if (age < 6 && parsed.articles?.length) {
          this.newsFeed = parsed.articles.slice(0, 6);
          this.isNewsLoading = false;
          return;
        }
      } catch {}
    }
  
    const url = this.serverName+"/api/news"; // backend endpoint
    console.log(url);
  
    fetch(url)
      .then(res => res.json())
      .then((data: any) => {
        this.newsFeed = (data.articles || []).slice(0, 6);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), articles: this.newsFeed })
        );
      })
      .catch(() => {
        this.newsFeed = [
          { title: 'AI in Healthcare', description: 'AI is improving diagnosis accuracy.' },
          { title: 'WHO warns on mental health', description: 'New report highlights rising stress.' }
        ];
      })
      .finally(() => (this.isNewsLoading = false));
  }
  

  toggleDescription(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // ---- Tasks ----
  loadTasks() {
    const saved = localStorage.getItem('doctorTasks');
    this.tasks = saved ? JSON.parse(saved) : [
      { text: '💧 Drink 8 glasses of water', done: false },
      { text: '🚶 Walk 10K steps', done: false },
      { text: '😊 Keep smiling — you’re doing great!', done: false }
    ];
  }

  addTask() {
    if (!this.newTask.trim()) return;
    this.tasks.push({ text: this.newTask.trim(), done: false });
    this.newTask = '';
    this.saveTasks();
  }

  deleteTask(i: number) {
    this.tasks.splice(i, 1);
    this.saveTasks();
  }

  toggleTask(i: number) {
    this.tasks[i].done = !this.tasks[i].done;
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('doctorTasks', JSON.stringify(this.tasks));
  }

  // ---- Notes ----
  loadNotes() {
    const saved = localStorage.getItem('doctorNotes');
    if (saved) this.notes = saved;
  }

  saveNotes() {
    localStorage.setItem('doctorNotes', this.notes);
  }

  clearNotes() {
    this.notes = '';
    localStorage.removeItem('doctorNotes');
  }

  // ---- Chart ----
  renderChart() {
    if (this.dashboardChart) this.dashboardChart.destroy();
    this.dashboardChart = new Chart('patientsChart', {
      type: 'bar',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'Patients per Day',
            data: this.patientPerDayData,
            backgroundColor: '#4f6ef7',
            borderRadius: 10,
            barThickness: 25
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#e3e7ff' } } },
        responsive: true
      }
    });
  }
}












