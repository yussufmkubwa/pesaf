import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      return this.router.parseUrl('/login');
    }

    const userRole = this.authService.getUserRole();
    const expectedRole = next.data['role'];

    console.log(`Role Guard - User Role: ${userRole}, Expected Role: ${expectedRole}`);

    // If no expected role is specified, allow access
    if (!expectedRole) {
      return true;
    }

    // Check if user has the required role
    if (userRole === expectedRole) {
      console.log('Role matches, allowing access');
      return true;
    } else {
      console.log('Role mismatch, redirecting based on user role');
      // Redirect to the appropriate dashboard based on the user's role
      if (userRole === 'admin') {
        return this.router.parseUrl('/admin-dashboard');
      } else if (userRole === 'farmer') {
        return this.router.parseUrl('/dashboard');
      } else {
        // If no valid role is found, redirect to the login page
        console.log('No valid role found, redirecting to login');
        return this.router.parseUrl('/login');
      }
    }
  }
}
