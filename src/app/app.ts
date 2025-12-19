import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CartService } from './services/cart';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,          // ✅ REQUIRED
    RouterLink,
    ClickOutsideDirective,
  ],
  templateUrl: './app.html',
})
export class App {
  showProfileMenu = false;
  mobileMenuOpen = false;
  cartCount = 0;

  isBrowser = false;
  loggedIn = false;

  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.loggedIn = localStorage.getItem('isLoggedIn') === 'true';

      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    }
  }

  /* ================= HEADER ================= */

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ================= AUTH ================= */

  isLoggedIn(): boolean {
  if (!this.isBrowser) return false;
  return localStorage.getItem('isLoggedIn') === 'true';
}

  logout() {
    if (!this.isBrowser) return;

    localStorage.removeItem('isLoggedIn');
    this.loggedIn = false;
    this.closeProfileMenu();
    this.closeMobileMenu();
  }
}