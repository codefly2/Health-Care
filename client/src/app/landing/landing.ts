import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  bookAppointment(): void {
    // You can route to a booking page or open a modal
    console.log('Booking appointment...');
  }

  aboutUs(): void {
    // Navigate to an About Us page if available
    console.log('Navigating to About Us...');
  }
}