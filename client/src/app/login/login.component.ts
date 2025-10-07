import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators'; // Import finalize for cleanup

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup; // Use definite assignment assertion or initialize in constructor
  formModel: any = {}; // Used for initial values if needed, but Reactive Forms manage state
  showError: boolean = false;
  errorMessage: string = ''; // Changed to string for consistency
  isLoading: boolean = false; // Added for button loading state

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordToggle') passwordToggle!: ElementRef<HTMLButtonElement>;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    // Moved form initialization to ngOnInit for better lifecycle management,
    // especially if formModel might come from async sources.
  }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      username: [this.formModel.username || '', [Validators.required]], // Ensure initial empty string if no model
      password: [this.formModel.password || '', [Validators.required]],
    });
  }

  onLogin(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched(); // Show validation errors for all fields
      return;
    }

    this.isLoading = true; // Start loading animation
    this.showError = false; // Reset error message

    this.httpService.Login(this.itemForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Ensure loading state is reset regardless of success/error
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data.userNo !== 0) { // Changed to !== for strict comparison
            this.authService.SetRole(data.role);
            this.authService.saveToken(data.token);
            this.authService.saveUserId(data.userId);
            this.router.navigateByUrl('/dashboard');

            setTimeout(() => {
              window.location.reload(); // Reload after navigation to ensure full app state reset/load
            }, 100); // Shorter delay for smoother feel
          } else {
            this.showError = true;
            this.errorMessage = "Wrong username or password."; // Consistent message
          }
        },
        error: (error) => {
          this.showError = true;
          this.errorMessage = error.message || "An error occurred while logging in. Please try again later.";
          console.error('Login error:', error);
        }
      });
  }

  // Helper to toggle password visibility
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