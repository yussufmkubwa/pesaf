import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface DeviceReading {
  id?: number;
  timestamp?: string;
  temperature: number;
  soil_moisture: number;
  device_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceReadingService {
  private apiUrl = environment.apiUrl + '/device-readings/';

  constructor(private http: HttpClient) { }

  getDeviceReadings(): Observable<DeviceReading[]> {
    return this.http.get<DeviceReading[]>(this.apiUrl);
  }

  getDeviceReadingById(id: number): Observable<DeviceReading> {
    return this.http.get<DeviceReading>(`${this.apiUrl}${id}/`);
  }

  createDeviceReading(reading: DeviceReading): Observable<DeviceReading> {
    return this.http.post<DeviceReading>(this.apiUrl, reading);
  }

  updateDeviceReading(id: number, reading: DeviceReading): Observable<DeviceReading> {
    return this.http.put<DeviceReading>(`${this.apiUrl}${id}/`, reading);
  }

  partialUpdateDeviceReading(id: number, reading: Partial<DeviceReading>): Observable<DeviceReading> {
    return this.http.patch<DeviceReading>(`${this.apiUrl}${id}/`, reading);
  }

  deleteDeviceReading(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
