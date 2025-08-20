import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardRedirectGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      return this.router.parseUrl('/login');
    }

    const userRole = this.authService.getUserRole();
    console.log(`Dashboard redirect guard - User role: ${userRole}`);
    
    if (userRole === 'admin') {
      console.log('Redirecting admin to admin dashboard');
      return this.router.parseUrl('/admin-dashboard');
    } else if (userRole === 'farmer') {
      console.log('Redirecting farmer to farmer dashboard');
      return this.router.parseUrl('/dashboard');
    } else {
      // If no valid role is found, redirect to login
      console.log('No valid role found, redirecting to login');
      this.authService.logout(); // Clear invalid session
      return this.router.parseUrl('/login');
    }
  }
}