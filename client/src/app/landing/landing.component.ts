import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit,AfterViewInit {
  typedText = '';
  fullTexts = [
    'Best Healthcare Solution In Your City',
    'Book Your Appointment Online',
    'Trusted Doctors Near You'
  ];
  textIndex = 0;
  charIndex = 0;
  typingSpeed = 80;
  pauseBetween = 1200;
constructor(private viewportScroller: ViewportScroller) {}
  ngAfterViewInit(): void {
      this.animateCounters();
  }

  ngOnInit() {
    this.typeText();
  }

  typeText() {
    if (this.charIndex < this.fullTexts[this.textIndex].length) {
      this.typedText += this.fullTexts[this.textIndex][this.charIndex];
      this.charIndex++;
      setTimeout(() => this.typeText(), this.typingSpeed);
    } else {
      setTimeout(() => this.eraseText(), this.pauseBetween);
    }
  }

  eraseText() {
    if (this.charIndex > 0) {
      this.typedText = this.typedText.slice(0, -1);
      this.charIndex--;
      setTimeout(() => this.eraseText(), this.typingSpeed / 2);
    } else {
      this.textIndex = (this.textIndex + 1) % this.fullTexts.length;
      setTimeout(() => this.typeText(), this.typingSpeed);
    }
  }
scrollToTop(event: Event) {
  event.preventDefault();
  this.viewportScroller.scrollToPosition([0, 0]);
}
animateCounters() {
    const counters = document.querySelectorAll<HTMLElement>(".counter");

    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target")!;
        const count = +counter.innerText;

        const increment = target / 200; // speed

        if (count < target) {
          counter.innerText = Math.ceil(count + increment).toString();
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target.toString();
        }
      };
      updateCount();
    });
  }
}