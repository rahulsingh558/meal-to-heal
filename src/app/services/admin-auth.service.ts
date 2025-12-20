import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly KEY = 'admin_logged_in';
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): boolean {
    // 🔐 HARDCODED CREDS
    if (username === 'admin' && password === 'admin123') {
      if (this.isBrowser) {
        localStorage.setItem(this.KEY, 'true');
      }
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) {
      return false; // ⛔ SSR SAFE
    }
    return localStorage.getItem(this.KEY) === 'true';
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.KEY);
    }
    this.router.navigate(['/admin/login']);
  }
}