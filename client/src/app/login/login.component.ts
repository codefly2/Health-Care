// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';



// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   itemForm: FormGroup;
//   formModel:any={};
//   showError:boolean=false;
//   errorMessage:any;
//   constructor(public router:Router, public httpService:HttpService, private formBuilder: FormBuilder, private authService:AuthService) 
//     {
//       this.itemForm = this.formBuilder.group({
//         username: [this.formModel.username,[ Validators.required]],
//         password: [this.formModel.password,[ Validators.required]],
       
//     });
//   }

//   ngOnInit(): void {
//   }
//   onLogin() {
//   if (this.itemForm.valid) {
//     this.showError = false;
//     this.httpService.Login(this.itemForm.value).subscribe((data: any) => {
//       if (data.userNo != 0) {
//         // debugger;
    
//         // localStorage.setItem('role', data.role);
//         this.authService.SetRole(data.role);
//         this.authService.saveToken(data.token)
//         this.authService.saveUserId(data.userId)
//         this.router.navigateByUrl('/dashboard');
      
        
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       } else {
//         this.showError = true;
//         this.errorMessage = "Wrong User or Password";
//       }
//     }, error => {
//       // Handle error
//       this.showError = true;
//       this.errorMessage = "An error occurred while logging in. Please try again later.";
//       console.error('Login error:', error);
//     });;
//   } else {
//     this.itemForm.markAllAsTouched();
//   }
// }

// registration()
//   {
//     this.router.navigateByUrl('/registration');
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm: FormGroup;
  otpForm: FormGroup;
  showError = false;
  errorMessage = '';
  otpSent = false;
  usernameForOtp = '';
  resendDisabled = true;
  resendTimer = 30;
  private resendInterval: any;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.itemForm.valid) {
      this.showError = false;
      const payload = this.itemForm.value;
      this.httpService.loginSendOtp(payload).subscribe({
        next: (res: any) => {
          if (res && res.message === 'OTP_SENT') {
            this.otpSent = true;
            this.usernameForOtp = res.username || this.itemForm.value.username;
            this.startResendTimer(30); // disable resend for 30s
          } else {
            this.showError = true;
            this.errorMessage = 'Login failed';
          }
        },
        error: (err) => {
          this.showError = true;
          this.errorMessage = err?.error?.message || 'Login error';
          console.error(err);
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  submitOtp() {
    if (this.otpForm.valid && this.usernameForOtp) {
      const payload = { username: this.usernameForOtp, otp: this.otpForm.value.otp };
      this.httpService.verifyOtp(payload).subscribe({
        next: (res: any) => {
          // res is LoginResponse with token
          if (res && res.token) {
            this.authService.saveToken(res.token);
            this.authService.saveUserId(String(res.userId));
            this.authService.SetRole(res.role);
            this.router.navigateByUrl('/dashboard').then(() => {
              window.location.reload();
            });
          } else {
            this.showError = true;
            this.errorMessage = 'OTP verification failed';
          }
        },
        error: (err) => {
          this.showError = true;
          this.errorMessage = err?.error?.message || 'OTP invalid or expired';
          console.error(err);
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  startResendTimer(seconds: number) {
    this.resendDisabled = true;
    this.resendTimer = seconds;
    if (this.resendInterval) clearInterval(this.resendInterval);
    this.resendInterval = setInterval(() => {
      this.resendTimer -= 1;
      if (this.resendTimer <= 0) {
        this.resendDisabled = false;
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  resendOtp() {
    if (!this.usernameForOtp) return;
    this.httpService.resendOtp({ username: this.usernameForOtp }).subscribe({
      next: (res: any) => {
        if (res && (res.message === 'OTP_RESENT' || res.message === 'OTP_SENT')) {
          this.startResendTimer(30);
        }
      },
      error: (err) => {
        if (err.status === 429 || err.error?.message === 'RESEND_COOLDOWN') {
          // server says cooldown not passed
          this.showError = true;
          this.errorMessage = 'You can resend only after 30 seconds';
        } else {
          this.showError = true;
          this.errorMessage = 'Failed to resend OTP';
        }
      }
    });
  }

  registration() {
    this.router.navigateByUrl('/registration');
  }
}