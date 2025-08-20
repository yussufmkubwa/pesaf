import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // First check if we have the role in localStorage
    this.userRole = this.authService.getUserRole();
    console.log(`Navigation - Current user role: ${this.userRole}`);
    
    // If we have an access token but no role, try to get it from the API
    if (this.authService.isLoggedIn() && !this.userRole) {
      console.log('No role found, fetching from API');
      this.authService.getMe().subscribe({
        next: (user) => {
          this.userRole = user.role;
          localStorage.setItem('userRole', user.role);
          console.log(`Role fetched from API: ${user.role}`);
        },
        error: (error) => {
          console.error('Failed to get user info in navigation', error);
          // If unauthorized, redirect to login
          if (error.status === 401) {
            this.logout();
          }
        }
      });
    }
  }

  isAdmin(): boolean {
    // Get the latest value directly from authService
    return this.authService.isAdmin();
  }

  isFarmer(): boolean {
    return this.authService.isFarmer();
  }

  logout() {
    console.log('Logging out user');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
