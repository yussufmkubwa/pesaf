import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface IrrigationEvent {
  id?: number;
  created_by?: string;
  timestamp?: string;
  duration_minutes: number;
  water_consumed_liters: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IrrigationEventService {
  private apiUrl = environment.apiUrl + '/irrigation-events/';

  constructor(private http: HttpClient) { }

  getIrrigationEvents(): Observable<IrrigationEvent[]> {
    return this.http.get<IrrigationEvent[]>(this.apiUrl);
  }

  getIrrigationEventById(id: number): Observable<IrrigationEvent> {
    return this.http.get<IrrigationEvent>(`${this.apiUrl}${id}/`);
  }

  createIrrigationEvent(event: IrrigationEvent): Observable<IrrigationEvent> {
    return this.http.post<IrrigationEvent>(this.apiUrl, event);
  }

  updateIrrigationEvent(id: number, event: IrrigationEvent): Observable<IrrigationEvent> {
    return this.http.put<IrrigationEvent>(`${this.apiUrl}${id}/`, event);
  }

  partialUpdateIrrigationEvent(id: number, event: Partial<IrrigationEvent>): Observable<IrrigationEvent> {
    return this.http.patch<IrrigationEvent>(`${this.apiUrl}${id}/`, event);
  }

  deleteIrrigationEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
