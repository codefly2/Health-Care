import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;
  responseMessage: any;
  isLoading: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordToggle') passwordToggle!: ElementRef<HTMLButtonElement>;

  // Password checklist properties
  passwordValidations = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumeric: false,
    hasSpecialChar: false
  };
  private passwordSubscription!: Subscription;

  // New property to control checklist visibility
  passwordFieldActive: boolean = false; // Initially false

  // Regular expressions for password validation
  private readonly MIN_LENGTH_REGEX = /^.{6,}$/;
  private readonly UPPERCASE_REGEX = /[A-Z]/;
  private readonly LOWERCASE_REGEX = /[a-z]/;
  private readonly NUMERIC_REGEX = /[0-9]/;
  private readonly SPECIAL_CHAR_REGEX = /[!@#$%^&]/;


  constructor(public router: Router, private bookService: HttpService, private formBuilder: FormBuilder) {
    this.itemForm = this.formBuilder.group({
      email: [this.formModel.email, [Validators.required, Validators.email]],
      password: [this.formModel.password, [Validators.required, Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&])[A-Za-z0-9!@#$%^&]{6,}')]],
      role: [this.formModel.role, [Validators.required]],
      username: [this.formModel.username, [Validators.required], [this.nameValidator()]],
      specialty: [this.formModel.specialty],
      availability: [this.formModel.availability],
    });
  }

  ngOnInit(): void {
    this.onRoleChange();
    if (!this.itemForm.get('role')?.value) {
      this.itemForm.get('role')?.setValue('PATIENT');
    }
    this.subscribeToPasswordChanges();
  }

  ngOnDestroy(): void {
    if (this.passwordSubscription) {
      this.passwordSubscription.unsubscribe();
    }
  }

  // New methods to handle focus and blur for the password field
  onPasswordFocus(): void {
    this.passwordFieldActive = true;
  }

  onPasswordBlur(): void {
    // Optionally hide on blur if field is empty, or keep visible if dirty
    // For now, let's keep it visible once activated for better user feedback
    // If you want to hide it when untouched/empty, add more complex logic here.
    // E.g., if (!this.itemForm.get('password')?.value) { this.passwordFieldActive = false; }
  }


  subscribeToPasswordChanges(): void {
    const passwordControl = this.itemForm.get('password');
    if (passwordControl) {
      this.passwordSubscription = passwordControl.valueChanges.subscribe(value => {
        // Only update checklist if the field is active
        if (this.passwordFieldActive) {
          this.updatePasswordValidationChecklist(value);
        }
      });
    }
  }

  updatePasswordValidationChecklist(password: string): void {
    this.passwordValidations.minLength = this.MIN_LENGTH_REGEX.test(password);
    this.passwordValidations.hasUpperCase = this.UPPERCASE_REGEX.test(password);
    this.passwordValidations.hasLowerCase = this.LOWERCASE_REGEX.test(password);
    this.passwordValidations.hasNumeric = this.NUMERIC_REGEX.test(password);
    this.passwordValidations.hasSpecialChar = this.SPECIAL_CHAR_REGEX.test(password);
  }

  nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.bookService.usernameExists(control.value).pipe(
        map(isTaken => {
          if (isTaken) {
            return { usernameTaken: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }

  onRoleChange() {
    this.itemForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'DOCTOR') {
        this.itemForm.get('specialty')?.setValidators([Validators.required]);
        this.itemForm.get('availability')?.setValidators([Validators.required]);
      } else {
        this.itemForm.get('specialty')?.clearValidators();
        this.itemForm.get('availability')?.clearValidators();
      }
      this.itemForm.get('specialty')?.updateValueAndValidity();
      this.itemForm.get('availability')?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    if (this.passwordInput) {
      this.passwordInput.nativeElement.type =
        this.passwordInput.nativeElement.type === 'password' ? 'text' : 'password';
      this.passwordToggle.nativeElement.classList.toggle('visible');
    }
  }

  onRegister() {
    this.showMessage = false;
    this.showError = false;
    this.errorMessage = '';
    this.passwordFieldActive = true; // Ensure checklist is visible on submission attempt

    if (this.itemForm.valid) {
      this.isLoading = true;
      let registerObservable: Observable<any>;

      switch (this.itemForm.controls["role"].value) {
        case "PATIENT":
          registerObservable = this.bookService.registerPatient(this.itemForm.value);
          break;
        case "DOCTOR":
          registerObservable = this.bookService.registerDoctors(this.itemForm.value);
          break;
        case "RECEPTIONIST":
          registerObservable = this.bookService.registerReceptionist(this.itemForm.value);
          break;
        default:
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = "Invalid role selected.";
          return;
      }

      registerObservable.subscribe(
        data => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = "You are successfully Registered";
          this.itemForm.reset({ role: 'PATIENT' });
          this.itemForm.markAsPristine();
          this.itemForm.markAsUntouched();
          this.updatePasswordValidationChecklist(''); // Reset checklist on successful registration
          this.passwordFieldActive = false; // Hide checklist after successful registration
        },
        error => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error?.message || "Registration failed. Please try again.";
          console.error("Registration error:", error);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}