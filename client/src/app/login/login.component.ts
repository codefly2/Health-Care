import { Component, OnInit } from '@angular/core';
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
  itemForm!: FormGroup;   // form initialized in ngOnInit
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // initialize form with required validators
    this.itemForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // getter for form controls
  get f() {
    return this.itemForm.controls;
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    const { username, password } = this.itemForm.value;

    // Example: Use AuthService to login
    this.authService.login(username, password).subscribe({
      next: (response) => {
        // assuming response has token or success flag
        if (response && response.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/dashboard']); // redirect after login
        } else {
          this.errorMessage = 'Invalid login credentials';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login failed. Please try again later.';
      }
    });
  }
}