import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink   // ✅ REQUIRED FOR HEADER LINKS
  ],
  templateUrl: './app.html',
})
export class App {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
