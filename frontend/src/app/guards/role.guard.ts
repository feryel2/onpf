import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const roles = route.data['roles'] as string[] || [];
    return this.auth.isAuthenticated() && this.auth.hasAnyRole(roles)
      ? true : this.router.createUrlTree(['/dashboard'], { queryParams: { error: 'unauthorized' } });
  }
}
