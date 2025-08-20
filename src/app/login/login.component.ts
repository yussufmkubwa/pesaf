import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (username && password) {
        console.log('Attempting login for:', username);
        
        this.authService.login({ username, password }).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            
            // First store the tokens in localStorage
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);
            
            // Try to parse the JWT token to get role information
            try {
              const tokenPayload = JSON.parse(atob(response.access.split('.')[1]));
              console.log('Token payload:', tokenPayload);
              
              if (tokenPayload.role) {
                localStorage.setItem('userRole', tokenPayload.role);
                console.log('Role from token:', tokenPayload.role);
                this.redirectBasedOnRole(tokenPayload.role);
                return;
              }
            } catch (e) {
              console.error('Failed to decode token', e);
            }
            
            // If we couldn't get the role from the token, try the /api/me endpoint
            console.log('Fetching user info from API');
            this.authService.getMe().subscribe({
              next: (user) => {
                console.log('User info from API:', user);
                localStorage.setItem('userRole', user.role);
                this.redirectBasedOnRole(user.role);
              },
              error: (error) => {
                console.error('Failed to get user info', error);
                // Set a default role and redirect
                localStorage.setItem('userRole', 'farmer');
                this.redirectBasedOnRole('farmer');
              }
            });
          },
          error: (error) => {
            console.error('Login failed', error);
            alert('Login failed. Please check your credentials.');
          }
        });
      }
    }
  }
  
  private redirectBasedOnRole(role: string) {
    console.log(`Redirecting based on role: ${role}`);
    if (role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'farmer') {
      this.router.navigate(['/dashboard']);
    } else {
      console.warn('Unknown role, defaulting to farmer dashboard');
      this.router.navigate(['/dashboard']);
    }
  }
}
