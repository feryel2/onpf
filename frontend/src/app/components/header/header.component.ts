import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentPage: string = 'الرئيسية';
  currentTime: string = '';
  currentUser: User | null = null;

  private pageNames: { [key: string]: string } = {
    '/dashboard': 'لوحة القيادة',
    '/files': 'الملفات العقارية',
    '/search': 'البحث',
    '/operations-log': 'سجل العمليات',
    '/users': 'المستخدمون والصلاحيات',
    '/settings': 'الإعدادات'
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000); // Update every minute

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPage = this.pageNames[event.urlAfterRedirects] || 'الرئيسية';
      });
  }

  private updateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    this.currentTime = now.toLocaleDateString('ar-TN', options);
  }

  get roleLabel(): string {
    return this.authService.getRoleLabel(this.currentUser?.role);
  }
}
