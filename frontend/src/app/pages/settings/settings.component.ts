import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  currentUser: User | null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(public auth: AuthService) {
    this.currentUser = auth.currentUserValue;
  }

  changePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.newPassword.length < 8) {
      this.errorMessage = 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'تأكيد كلمة المرور غير مطابق.';
      return;
    }

    this.saving = true;
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: response => {
        this.saving = false;
        this.successMessage = response.message;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.error?.message || 'تعذر تغيير كلمة المرور.';
      }
    });
  }
}
