import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  canAccessStudy(): boolean {
    return this.authService.hasRole('EDITOR');
  }

  canAccessVerification(): boolean {
    return this.authService.hasRole('VERIFIER');
  }

  canAccessFinalVerification(): boolean {
    return this.authService.hasRole('SENIOR_VERIFIER');
  }

  canAccessUsers(): boolean {
    return this.authService.hasRole('SENIOR_VERIFIER');
  }

  get roleLabel(): string {
    return this.authService.getRoleLabel(this.currentUser?.role);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
