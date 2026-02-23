import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    step = 1;
    identifier = '';
    otp = '';
    newPassword = '';
    confirmPassword = '';

    isLoading = false;
    message = '';
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private cd: ChangeDetectorRef
    ) { }

    sendOtp() {
        if (!this.identifier) {
            this.error = 'Please enter your email or phone number';
            return;
        }

        this.isLoading = true;
        this.error = '';
        this.message = '';

        this.authService.forgotPassword(this.identifier).subscribe({
            next: (res) => {
                this.isLoading = false;
                const type = res.type === 'email' ? 'email' : 'phone';
                this.message = `OTP sent successfully to your ${type}`;
                this.step = 2;
                this.cd.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Failed to send OTP';
                this.cd.detectChanges();
            }
        });
    }

    verifyOtp() {
        if (!this.otp) {
            this.error = 'Please enter the OTP';
            return;
        }

        this.isLoading = true;
        this.error = '';
        this.message = '';

        this.authService.verifyResetOtp(this.identifier, this.otp).subscribe({
            next: () => {
                this.isLoading = false;
                this.message = 'OTP verified';
                this.step = 3;
                this.cd.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Invalid OTP';
                this.cd.detectChanges();
            }
        });
    }

    resetPassword() {
        if (!this.newPassword || !this.confirmPassword) {
            this.error = 'Please enter and confirm your new password';
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }

        this.isLoading = true;
        this.error = '';
        this.message = '';

        this.authService.resetPassword(this.identifier, this.otp, this.newPassword).subscribe({
            next: () => {
                this.isLoading = false;
                this.message = 'Password reset successfully. Redirecting to login...';
                this.cd.detectChanges();
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Failed to reset password';
                this.cd.detectChanges();
            }
        });
    }
}
