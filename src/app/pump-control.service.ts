import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PumpControl {
  id?: number;
  timestamp?: string;
  status: 'ON' | 'OFF';
  control_type?: 'MANUAL' | 'AUTOMATIC';
  controlled_by?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PumpControlService {
  // Updated to match the API endpoints described
  private apiUrl = environment.apiUrl + '/api/devices/pump-control/';
  private iotApiUrl = environment.apiUrl + '/api/iot/pump-control/';

  constructor(private http: HttpClient) { }

  // Web interface (Authenticated) endpoint
  getPumpStatus(): Observable<PumpControl[]> {
    return this.http.get<PumpControl[]>(this.apiUrl);
  }

  // Get latest pump status
  getLatestPumpStatus(): Observable<PumpControl> {
    return this.http.get<PumpControl>(`${this.apiUrl}latest/`);
  }
  
  // Set pump status (Web interface)
  setPumpStatus(status: 'ON' | 'OFF', control_type: 'MANUAL' | 'AUTOMATIC' = 'MANUAL'): Observable<PumpControl> {
    return this.http.post<PumpControl>(this.apiUrl, { status, control_type });
  }
  
  // Get IoT device pump control commands (unauthenticated)
  getIoTPumpControlCommands(): Observable<PumpControl> {
    return this.http.get<PumpControl>(this.iotApiUrl);
  }
}
