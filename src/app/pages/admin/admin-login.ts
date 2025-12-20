import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  showPass: boolean = false;
  username = '';
  password = '';
  error = '';

  constructor(
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  login() {
    if (this.adminAuth.login(this.username, this.password)) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = 'Invalid admin credentials';
    }
  }
}