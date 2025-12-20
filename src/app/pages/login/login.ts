import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  // Main login form
  email = '';
  password = '';
  error = '';
  showPass = false;

  // WhatsApp modal
  showWhatsAppModal = false;
  whatsappNumber = '';
  countryCode = '+1';
  otpSent = false;
  otp: string[] = ['', '', '', '', '', ''];
  resendTimer = 0;
  generatedOTP = '';
  otpInterval: any;

  constructor(private router: Router) {}

  // Main login method
  login() {
    this.error = '';
    
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }
    
    console.log('Logging in with:', { email: this.email });
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', this.email);
    
    const redirect = localStorage.getItem('redirectAfterLogin') || '/dashboard';
    localStorage.removeItem('redirectAfterLogin');
    
    this.router.navigate([redirect]);
  }

  // Google login
  loginWithGoogle() {
    console.log('Google login clicked');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authProvider', 'google');
    this.router.navigate(['/dashboard']);
  }

  // WhatsApp modal methods
  openWhatsAppModal() {
    this.showWhatsAppModal = true;
    this.resetWhatsAppForm();
  }

  closeWhatsAppModal() {
    this.showWhatsAppModal = false;
    this.resetWhatsAppForm();
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
  }

  resetWhatsAppForm() {
    this.whatsappNumber = '';
    this.otpSent = false;
    this.otp = ['', '', '', '', '', ''];
    this.resendTimer = 0;
    this.generatedOTP = '';
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
  }

  // Request OTP
  requestOTP() {
    if (!this.whatsappNumber || this.whatsappNumber.length < 10) {
      return;
    }

    // Generate random 6-digit OTP
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`OTP ${this.generatedOTP} sent to ${this.countryCode}${this.whatsappNumber}`);
    
    // In production, you would send this OTP via WhatsApp API
    // For demo, we'll just log it and show in console
    console.log(`DEMO: OTP is ${this.generatedOTP} - In production, this would be sent via WhatsApp`);
    
    // Start resend timer (60 seconds)
    this.resendTimer = 60;
    this.otpInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.otpInterval);
      }
    }, 1000);

    this.otpSent = true;
  }

  // Resend OTP
  resendOTP() {
    // Generate new OTP
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`New OTP ${this.generatedOTP} sent to ${this.countryCode}${this.whatsappNumber}`);
    
    // Reset timer
    this.resendTimer = 60;
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
    }
    this.otpInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.otpInterval);
      }
    }, 1000);
    
    // Clear OTP input
    this.otp = ['', '', '', '', '', ''];
  }

  // OTP input handling
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      this.otp[index] = '';
      return;
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`[ng-reflect-name="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Auto-focus previous on backspace if empty
    if (!value && index > 0 && event.inputType === 'deleteContentBackward') {
      const prevInput = document.querySelector(`[ng-reflect-name="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prevInput = document.querySelector(`[ng-reflect-name="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`[ng-reflect-name="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelector(`[ng-reflect-name="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain').trim();
    
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      for (let i = 0; i < 6; i++) {
        this.otp[i] = pastedData[i];
      }
      
      // Focus last input
      const lastInput = document.querySelector('[ng-reflect-name="5"]') as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    }
  }

  // Check if OTP is complete
  isOtpComplete(): boolean {
    return this.otp.every(digit => digit !== '');
  }

  // Verify OTP
  verifyOTP() {
    const enteredOTP = this.otp.join('');
    
    if (enteredOTP === this.generatedOTP) {
      console.log('WhatsApp OTP verified successfully');
      
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authProvider', 'whatsapp');
      localStorage.setItem('userPhone', this.countryCode + this.whatsappNumber);
      
      // Close modal
      this.closeWhatsAppModal();
      
      // Redirect to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid OTP. Please try again.';
      // Clear OTP for retry
      this.otp = ['', '', '', '', '', ''];
      // Focus first input
      setTimeout(() => {
        const firstInput = document.querySelector('[ng-reflect-name="0"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }
}