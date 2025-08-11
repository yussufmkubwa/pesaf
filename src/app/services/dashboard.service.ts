import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = `${environment.apiUrl}/api/irrigation-events/`;
  constructor(private http: HttpClient) {
    console.log('DashboardService url:', this.url);
  }

  getAllIrrigationEvents(): Observable<any> {
    return this.http.get(this.url);
  }

  addIrrigationEvent(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }

  getIrrigationEventById(id: any): Observable<any> {
    return this.http.get(`${this.url}${id}/`);
  }

  update(body: any, id: any): Observable<any> {
    return this.http.put(`${this.url}${id}/`, body);
  }

  deleteIrrigationEvent(id: any): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
  
}
