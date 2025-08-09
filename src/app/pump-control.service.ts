import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PumpControl {
  status: 'ON' | 'OFF';
  control_type?: 'MANUAL' | 'AUTOMATIC';
}

@Injectable({
  providedIn: 'root'
})
export class PumpControlService {
  private apiUrl = environment.apiUrl + '/api/pump-control/';

  constructor(private http: HttpClient) { }

  getPumpStatus(): Observable<PumpControl> {
    return this.http.get<PumpControl>(this.apiUrl);
  }

  setPumpStatus(status: 'ON' | 'OFF'): Observable<PumpControl> {
    return this.http.post<PumpControl>(this.apiUrl, { status });
  }
}
