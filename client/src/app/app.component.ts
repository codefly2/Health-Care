
// import { Component } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   IsLoggin:any=false;
//   roleName: string | null;
//   constructor(private authService: AuthService, private router:Router)
//   {
   
//     this.IsLoggin=authService.getLoginStatus;
//     this.roleName=authService.getRole;
//     if(this.IsLoggin==false)
//     {
//       this.router.navigateByUrl('/login'); 
    
//     }
//   }
//   logout()
// {
//   this.authService.logout();
//   window.location.reload();
// }

// }

import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // Curtain drop (top → down)
    trigger('slideInAnim', [
      state('hidden', style({ transform: 'scaleY(0)' })),
      state('visible', style({ transform: 'scaleY(1)' })),
      transition('hidden => visible', [
        animate('1s cubic-bezier(0.22, 1, 0.36, 1)')
      ]),
      transition('visible => hidden', [
        animate('1s cubic-bezier(0.22, 1, 0.36, 1)')
      ])
    ]),

    // Curtain lift (bottom → up)
    trigger('slideOutAnim', [
      state('hidden', style({ transform: 'scaleY(1)' })),
      state('visible', style({ transform: 'scaleY(0)' })),
      transition('hidden => visible', [
        animate('1s cubic-bezier(0.22, 1, 0.36, 1)')
      ]),
      transition('visible => hidden', [
        animate('1s cubic-bezier(0.22, 1, 0.36, 1)')
      ])
    ])
  ]
})
export class AppComponent {
  slideInState: 'hidden' | 'visible' = 'hidden';
  slideOutState: 'hidden' | 'visible' = 'hidden';
  showSlideIn = false;
  showSlideOut = false;

  IsLoggin = false;
  roleName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.IsLoggin = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;

    if(this.IsLoggin==false)
    {
      this.router.navigateByUrl('/dashboard'); 
    
    }
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  onRouteActivate() {
    /** Step 1: Curtain drop (slide-in) **/
    this.showSlideIn = true;
    this.slideInState = 'hidden'; // reset first
    setTimeout(() => {
      this.slideInState = 'visible'; // trigger drop animation
    }, 50); // small delay ensures DOM is ready

    /** Step 2: After drop completes (1s), start lift **/
    setTimeout(() => {
      this.slideInState = 'hidden'; // retract drop
      this.showSlideIn = false;

      this.showSlideOut = true;
      this.slideOutState = 'hidden'; // reset
      setTimeout(() => {
        this.slideOutState = 'visible'; // lift up
      }, 50);

      /** Step 3: Hide after animation **/
      setTimeout(() => {
        this.showSlideOut = false;
      }, 1200);
    }, 1100);
  }
}

