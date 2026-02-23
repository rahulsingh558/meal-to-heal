import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChatWidgetComponent } from './components/chat/chat.component';
import { ToastComponent } from './components/toast/toast.component';

import { provideHttpClient } from '@angular/common/http';

export const appConfig = {
  providers: [provideHttpClient()]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChatWidgetComponent,
    ToastComponent,
  ],
  template: `
    <app-header *ngIf="showLayout"></app-header>
    
    <router-outlet></router-outlet>
    
    <app-footer *ngIf="showLayout"></app-footer>
    
    <app-chat-widget></app-chat-widget>
    <app-toast></app-toast>
  `
})
export class App {
  isBrowser = false;
  showLayout = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const url = event.urlAfterRedirects;
          const hideLayoutRoutes = ['/admin', '/login', '/signup', '/register', '/auth', '/forgot-password', '/delivery-tracking', '/track-order'];
          this.showLayout = !hideLayoutRoutes.some(route => url.startsWith(route));
        });
    }
  }
}