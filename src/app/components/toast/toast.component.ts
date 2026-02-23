import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts"
           [@fadeInOut]
           [ngClass]="'toast toast-' + toast.type">
        <div class="toast-content">
          <h4 class="toast-title">{{ toast.title }}</h4>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button (click)="remove(toast)" class="toast-close">✕</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toast {
      min-width: 300px;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 4px solid;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      animation: slideIn 0.3s ease-out;
    }
    .toast-success {
      background: #e8f5e9;
      border-color: #2E7D32;
      color: #1B5E20;
    }
    .toast-error {
      background: #ffebee;
      border-color: #c62828;
      color: #b71c1c;
    }
    .toast-info {
      background: #e3f2fd;
      border-color: #1565c0;
      color: #0d47a1;
    }
    .toast-warning {
      background: #fff3e0;
      border-color: #e65100;
      color: #bf360c;
    }
    .toast-title {
      font-weight: 700;
      font-size: 0.875rem;
      margin: 0;
    }
    .toast-message {
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
      opacity: 0.9;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 0.875rem;
      font-weight: bold;
      opacity: 0.6;
      cursor: pointer;
      margin-left: 1rem;
      padding: 0;
    }
    .toast-close:hover {
      opacity: 1;
    }
  `],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastComponent implements OnInit {
    toasts: ToastMessage[] = [];

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.toastService.toasts$.subscribe(toasts => {
            this.toasts = toasts;
        });
    }

    remove(toast: ToastMessage) {
        this.toastService.remove(toast);
    }
}
