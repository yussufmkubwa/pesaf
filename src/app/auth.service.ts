import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/login/';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}
