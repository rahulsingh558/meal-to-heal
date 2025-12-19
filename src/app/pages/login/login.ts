import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule], // ✅ REQUIRED
  templateUrl: './login.html',
})
export class Login {
  email = 'meyok';
  password = 'Krahul@558';
  error = '';

  constructor(private router: Router) {}

  login() {
  if (!this.email || !this.password) {
    this.error = 'Please enter email and password';
    return;
  }

  localStorage.setItem('isLoggedIn', 'true');

  const redirect =
    localStorage.getItem('redirectAfterLogin') || '/';

  localStorage.removeItem('redirectAfterLogin');
  this.router.navigate([redirect]);
}
}