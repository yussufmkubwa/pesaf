import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // Try to load user from local storage on service initialization
    this.loadUserFromStorage();
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login/`, credentials).pipe(
      tap((response: any) => {
        if (response && response.access) {
          this.setTokens(response);
          this.loadUserProfile();
        }
      })
    );
  }

  getMe(): Observable<User> {
    // Return cached user if available
    if (this.currentUser) {
      return of(this.currentUser);
    }
    
    return this.http.get<User>(`${this.apiUrl}/api/auth/me/`).pipe(
      tap(user => {
        this.currentUser = user;
        this.setUserRole(user.role);
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(() => new Error('Failed to load user profile'));
      })
    );
  }

  setTokens(tokens: { access: string, refresh: string }) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  }
  
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    this.currentUser = null;
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
  
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  getUserRole(): string {
    const role = localStorage.getItem('userRole');
    if (!role) {
      console.warn('No user role found in localStorage');
      return 'farmer'; // Default to farmer if not set
    }
    return role;
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
  
  isFarmer(): boolean {
    return this.getUserRole() === 'farmer';
  }
  
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }
  
  private setUserRole(role: string): void {
    console.log(`Setting user role to: ${role}`);
    localStorage.setItem('userRole', role);
  }
  
  private loadUserProfile(): void {
    this.getMe().subscribe({
      next: (user) => {
        console.log('User profile loaded:', user);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }
  
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data from storage:', e);
      }
    }
  }
}
