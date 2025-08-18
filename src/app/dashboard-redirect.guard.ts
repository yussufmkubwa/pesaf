import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardRedirectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'admin') {
      return this.router.parseUrl('/admin-dashboard');
    } else if (userRole === 'farmer') {
      return this.router.parseUrl('/dashboard');
    } else {
      // If no role is found, redirect to login
      return this.router.parseUrl('/login');
    }
  }
}