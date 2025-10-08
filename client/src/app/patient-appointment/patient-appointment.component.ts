import { Component, NgZone, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

declare global {
  interface Window { webkitSpeechRecognition: any; }
}

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.scss']
})
export class PatientAppointmentComponent implements OnInit {
  appointmentList$: any;
  filteredAppointments$: any;
  paginatedList$: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  qrCodes: any = {};
  selectedQr: string | null = null;

  chatbotOpen = false;
  chatMessages: { sender: string, text: string }[] = [];
  userMessage: string = '';

  // Voice booking state
  recognition: any = null;
  listening: boolean = false;
  transcript: string = '';
  stage: 'idle' | 'awaiting_trigger' | 'awaiting_doctor' = 'idle';
  doctors: any[] = [];
  matchedDoctor: any = null;
  patientId: number | null = null; // derived from localStorage
  feedbackMsg: string = '';

  constructor(public httpService: HttpService, private ngZone: NgZone) {}

  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    this.patientId = userIdString ? parseInt(userIdString, 10) : null;

    this.getAppointments();
    this.loadDoctors();
    this.setupRecognition();
  }

  /* ---------- Existing methods (unchanged or slightly adapted) ---------- */

  getAppointments() {
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    this.httpService.getAppointmentByPatient(userId).subscribe((data:any) => {
      this.appointmentList$ = of(data);
      this.filteredAppointments$ = of(data);
      this.updatePaginatedList();
      data.forEach((appointment:any)=>{
        this.httpService.getAppointmentQr(appointment.id).subscribe(qr=>{
          this.qrCodes[appointment.id] = qr;
        });
      });
    });
  }

  searchAppointments(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase();
    this.filteredAppointments$ = this.appointmentList$.pipe(
      map((appointments: any[]) => {
        if (!searchTerm) {
           return appointments;
        }
         return appointments.filter(appointment =>
          appointment.doctor.username.toLowerCase().includes(searchTerm) || appointment.id.toString().includes(searchTerm)
        );
      })
    );
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    this.filteredAppointments$.subscribe((appointments: any[]) => {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList$ = appointments.slice(startIndex, endIndex);
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get totalPages(): number {
    let totalItems = 0;
    this.filteredAppointments$.subscribe((appointments: any[]) => {
      totalItems = appointments.length;
    });
    return Math.ceil(totalItems / this.itemsPerPage);
  }
  openQr(qr:string){
    this.selectedQr = qr;
  }

  //chatbot
  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.chatMessages.push({ sender: 'You', text: this.userMessage });

    this.httpService.chatWithAI(this.userMessage).subscribe((res:any) => {
      this.chatMessages.push({ sender: 'Bot', text: res.reply });
    });

    this.userMessage = '';
  }

  /* ---------- Voice booking related methods ---------- */

  setupRecognition() {
    const SpeechRecognition = window['webkitSpeechRecognition'] || (window as any).SpeechRecognition || null;
    if (!SpeechRecognition) {
      this.feedbackMsg = 'Voice recognition is not supported in this browser.';
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.ngZone.run(() => {
        this.listening = true;
        this.feedbackMsg = 'Listening...';
      });
    };

    this.recognition.onend = () => {
      // recognition has stopped (either because we stopped it or silence)
      this.ngZone.run(() => {
        this.listening = false;
        // If still in awaiting_doctor stage, keep stage (user may trigger again)
        if (this.stage === 'idle') {
          this.feedbackMsg = '';
        }
      });
    };

    this.recognition.onerror = (event: any) => {
      this.ngZone.run(() => {
        console.error('Speech recognition error', event);
        this.feedbackMsg = 'Voice recognition error: ' + (event.error || 'unknown');
        this.listening = false;
      });
    };

    this.recognition.onresult = (event: any) => {
      const transcript = (event.results[0][0].transcript || '').trim();
      this.ngZone.run(() => {
        this.transcript = transcript;
      });
      this.handleSpokenText(transcript);
    };
  }

  startVoiceBooking() {
    this.transcript = '';
    this.feedbackMsg = '';
    if (!this.recognition) {
      this.setupRecognition();
      if (!this.recognition) return;
    }
    // Kick into awaiting_trigger stage
    this.stage = 'awaiting_trigger';
    this.speak('Say "book an appointment" to start booking.');
    this.startListeningOnce();
  }

  startListeningOnce() {
    try {
      this.recognition.start();
    } catch (e) {
      // sometimes start throws if already started
      console.warn('recognition start failed', e);
    }
  }

  stopListening() {
    try {
      if (this.recognition) this.recognition.stop();
    } catch (e) { /* ignore */ }
  }

  handleSpokenText(text: string) {
    const t = text.toLowerCase();
    if (this.stage === 'awaiting_trigger') {
      // If user said something like "book an appointment" or "book doctor appointment"
      if (t.includes('book') || (t.includes('appointment') || t.includes('doctor'))) {
        // proceed: list doctors and ask to select
        if (!this.doctors || this.doctors.length === 0) {
          this.speak('I could not find any doctors. Please try later.');
          this.stage = 'idle';
          return;
        }
        const names = this.doctors.map(d => d.username).slice(0, 6); // limit to 6 names in speech
        const namesSpoken = names.join(', ');
        this.stage = 'awaiting_doctor';
        this.speak(`I found ${this.doctors.length} doctors. ${namesSpoken}. Which doctor would you like? Please say the doctor name.`);
        // start listening again for doctor's name
        setTimeout(()=> this.startListeningOnce(), 9000);
      } else {
        // didn't catch a trigger - re-prompt
        this.speak('I did not hear a booking request. Say "book an appointment" to begin.');
        this.stage = 'idle';
      }
      return;
    }

    if (this.stage === 'awaiting_doctor') {
      // try to match doctor name
      const spoken = t;
      let matched = this.findDoctorBySpokenName(spoken);
      if (!matched) {
        // try each doctor username fuzzy contains
        matched = this.doctors.find(d => spoken.includes(d.username.toLowerCase()));
      }
      if (!matched) {
        this.speak('No such doctor found. Please try again or click voice book to restart.');
        this.stage = 'idle';
        return;
      }
      // matched doctor: schedule appointment
      this.matchedDoctor = matched;
      this.speak(`You selected Dr. ${matched.username}. I will book an appointment now.`);
      this.stage = 'idle';
      this.stopListening();
      this.scheduleAppointmentForDoctor(matched);
      return;
    }

    // default fallback
    this.speak('I did not understand. Please try again.');
    this.stage = 'idle';
  }

  findDoctorBySpokenName(spoken: string) {
    const s = spoken.toLowerCase();
    // compare with username and email local-part if available
    for (const d of this.doctors) {
      if (!d) continue;
      const uname = (d.username || '').toLowerCase();
      const emailLocal = (d.email || '').split('@')[0].toLowerCase();
      if (s === uname || s.includes(uname) || s.includes(emailLocal) || uname.includes(s)) {
        return d;
      }
    }
    // fallback: try similarity by words
    for (const d of this.doctors) {
      const uname = (d.username || '').toLowerCase();
      if (uname.split(' ').some((w:any) => s.includes(w))) return d;
    }
    return null;
  }

  scheduleAppointmentForDoctor(doctor: any) {
    if (!this.patientId) {
      this.speak('Cannot determine patient. Please login.');
      return;
    }
    // Default appointment time: now + 1 hour (ISO string)
const dt = new Date();
dt.setHours(dt.getHours() + 1);

const formattedTime = dt.getFullYear() + '-' +
  String(dt.getMonth() + 1).padStart(2, '0') + '-' +
  String(dt.getDate()).padStart(2, '0') + ' ' +
  String(dt.getHours()).padStart(2, '0') + ':' +
  String(dt.getMinutes()).padStart(2, '0') + ':' +
  String(dt.getSeconds()).padStart(2, '0');

const details: any = {
  patientId: this.patientId,
  doctorId: doctor.id,
  time: formattedTime
};

    this.httpService.ScheduleAppointment(details).subscribe({
      next: (res:any) => {
        this.speak('Appointment booked successfully.');
        this.feedbackMsg = `Appointment booked with Dr. ${doctor.username}.`;
        // refresh appointments
        this.getAppointments();
      },
      error: (err:any) => {
        console.error('Booking failed', err);
        this.speak('Failed to book appointment. Please try again later.');
        this.feedbackMsg = 'Booking failed.';
      }
    });
  }

  speak(text: string) {
    try {
      if (!('speechSynthesis' in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      // You can set voice, pitch, rate if you want:
      // utter.pitch = 1;
      // utter.rate = 1;
      window.speechSynthesis.cancel(); // stop any current speech
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('speech synthesis failed', e);
    }
  }

  loadDoctors() {
    this.httpService.getDoctors().subscribe((res:any) => {
      // Expecting array of Doctor objects
      this.ngZone.run(() => {
        this.doctors = res || [];
      });
    }, err => {
      console.error('Could not load doctors', err);
    });
  }
}

