import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatTabsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  loginError = '';
  registerError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.loginError = '';
    this.cdr.markForCheck();

    const { username, password } = this.loginForm.value;
    this.auth.login(username, password).subscribe({
      next: () => { this.router.navigate(['/recipes']); },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error?.message || 'Hiba történt a bejelentkezés során';
        this.cdr.markForCheck();
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.registerError = '';
    this.cdr.markForCheck();

    const { username, password } = this.registerForm.value;
    this.auth.register(username, password).subscribe({
      next: () => { this.router.navigate(['/recipes']); },
      error: (err) => {
        this.loading = false;
        this.registerError = err.error?.message || 'Hiba történt a regisztráció során';
        this.cdr.markForCheck();
      }
    });
  }
}
