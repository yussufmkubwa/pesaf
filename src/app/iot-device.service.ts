import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DeviceReading } from './device-reading.service';
import { PumpControl } from './pump-control.service';

@Injectable({
  providedIn: 'root'
})
export class IoTDeviceService {
  private apiUrl = environment.apiUrl + '/api/iot/';

  constructor(private http: HttpClient) { }

  // Send data from IoT devices (unauthenticated)
  // POST /api/iot/readings/
  sendDeviceReadings(reading: DeviceReading): Observable<DeviceReading> {
    return this.http.post<DeviceReading>(`${this.apiUrl}readings/`, reading);
  }

  // Get IoT device readings (unauthenticated)
  // GET /api/iot/readings/
  getDeviceReadings(): Observable<DeviceReading[]> {
    return this.http.get<DeviceReading[]>(`${this.apiUrl}readings/`);
  }

  // Get pump control commands for IoT devices (unauthenticated)
  // GET /api/iot/pump-control/
  getPumpControlCommands(): Observable<PumpControl> {
    return this.http.get<PumpControl>(`${this.apiUrl}pump-control/`);
  }

  // Update pump status from IoT device (unauthenticated)
  // Used for devices to report their current status
  // POST /api/iot/pump-control/status/
  updatePumpStatus(status: PumpControl): Observable<PumpControl> {
    return this.http.post<PumpControl>(`${this.apiUrl}pump-control/status/`, status);
  }
}