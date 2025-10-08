import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

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
  isLoading = false;

  otpSent = false;
  usernameForOtp = '';
  resendDisabled = true;
  resendTimer = 30;
  private resendInterval: any;

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordToggle') passwordToggle!: ElementRef<HTMLButtonElement>;

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

  onLogin(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showError = false;

    const payload = this.itemForm.value;
    this.httpService.loginSendOtp(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.message === 'OTP_SENT') {
          this.otpSent = true;
          this.usernameForOtp = res.username || this.itemForm.value.username;
          this.startResendTimer(30);
        } else {
          this.showError = true;
          this.errorMessage = 'Login failed';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = err?.error?.message || 'Login error';
        console.error(err);
      }
    });
  }

  submitOtp(): void {
    if (this.otpForm.invalid || !this.usernameForOtp) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = { username: this.usernameForOtp, otp: this.otpForm.value.otp };
    this.httpService.verifyOtp(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
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
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = err?.error?.message || 'OTP invalid or expired';
        console.error(err);
      }
    });
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
          this.showError = true;
          this.errorMessage = 'You can resend only after 30 seconds';
        } else {
          this.showError = true;
          this.errorMessage = 'Failed to resend OTP';
        }
      }
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    if (this.passwordInput && this.passwordInput.nativeElement) {
      const input = this.passwordInput.nativeElement;
      const button = this.passwordToggle.nativeElement;
      if (input.type === 'password') {
        input.type = 'text';
        button.classList.add('visible');
      } else {
        input.type = 'password';
        button.classList.remove('visible');
      }
    }
  }

  registration(): void {
    this.router.navigateByUrl('/registration');
  }
}