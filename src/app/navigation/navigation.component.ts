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
    // First check if we have the role in localStorage
    this.userRole = localStorage.getItem('userRole');
    
    // If we have an access token but no role, try to get it from the API
    if (localStorage.getItem('accessToken') && !this.userRole) {
      this.authService.getMe().subscribe({
        next: (user) => {
          this.userRole = user.role;
          localStorage.setItem('userRole', user.role);
        },
        error: (error) => {
          console.error('Failed to get user info in navigation', error);
          // If unauthorized, redirect to login
          if (error.status === 401) {
            this.logout();
          }
        }
      });
    } else if (!localStorage.getItem('accessToken')) {
      // No token, redirect to login
      this.router.navigate(['/login']);
    }
  }

  isAdmin(): boolean {
    // Get the latest value directly from localStorage
    return localStorage.getItem('userRole') === 'admin';
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
