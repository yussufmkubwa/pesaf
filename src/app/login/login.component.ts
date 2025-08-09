import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (username && password) {
        this.authService.login({ username, password }).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userRole', response.role);
            if (response.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            console.error('Login failed', error);
          }
        });
      }
    }
  }
}
