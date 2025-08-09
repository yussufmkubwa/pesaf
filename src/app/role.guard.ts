import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = localStorage.getItem('userRole');
    const expectedRole = next.data['role'];

    if (userRole === expectedRole) {
      return true;
    } else {
      // Redirect to the appropriate dashboard based on the user's role
      if (userRole === 'admin') {
        return this.router.parseUrl('/admin-dashboard');
      } else if (userRole === 'farmer') {
        return this.router.parseUrl('/dashboard');
      } else {
        // If no role is found, redirect to the login page
        return this.router.parseUrl('/login');
      }
    }
  }
}
