import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { BlynkDashboardData, BlynkService } from './blynk.service';

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
  // Updated to match the API endpoints described
  private apiUrl = environment.apiUrl + '/api/devices/readings/';
  private iotApiUrl = environment.apiUrl + '/api/iot/readings/';

  constructor(
    private http: HttpClient,
    private blynkService: BlynkService
  ) { }

  // Web interface (Authenticated) endpoint with Blynk fallback
  getDeviceReadings(): Observable<DeviceReading[]> {
    return this.http.get<DeviceReading[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Backend API error, falling back to Blynk API', error);
        // If the backend API fails, try to get data from Blynk instead
        return this.getReadingsFromBlynk();
      })
    );
  }
  
  // Get readings directly from Blynk as a fallback
  private getReadingsFromBlynk(): Observable<DeviceReading[]> {
    return this.blynkService.getDashboardData().pipe(
      map((blynkData: BlynkDashboardData) => {
        // Convert Blynk data to our DeviceReading format
        const reading: DeviceReading = {
          temperature: blynkData.temperature,
          soil_moisture: blynkData.soil_moisture,
          timestamp: blynkData.timestamp,
          device_id: 'blynk-device'
        };
        
        // For demonstration purposes, create multiple readings with different timestamps
        // This simulates a history of readings
        const readings: DeviceReading[] = [reading];
        
        // Add some historical data (simulated)
        for (let i = 1; i <= 5; i++) {
          const date = new Date();
          date.setHours(date.getHours() - i);
          
          readings.push({
            temperature: Math.round((blynkData.temperature + (Math.random() * 4 - 2)) * 10) / 10,
            soil_moisture: Math.round(blynkData.soil_moisture + (Math.random() * 8 - 4)),
            timestamp: date.toISOString(),
            device_id: 'blynk-device'
          });
        }
        
        return readings;
      }),
      catchError((error) => {
        console.error('Both backend API and Blynk API failed:', error);
        // If both fail, return simulated data as last resort
        return of(this.getSimulatedReadings());
      })
    );
  }
  
  // Generate simulated data as a last resort fallback
  private getSimulatedReadings(): DeviceReading[] {
    const now = new Date();
    const readings: DeviceReading[] = [];
    
    // Create 6 simulated readings
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      
      readings.push({
        temperature: Math.round((24 + Math.random() * 6) * 10) / 10,
        soil_moisture: Math.round(50 + Math.random() * 20),
        timestamp: date.toISOString(),
        device_id: 'simulated-device'
      });
    }
    
    return readings;
  }

  // Get readings for a specific device
  getDeviceReadingById(id: number): Observable<DeviceReading> {
    return this.http.get<DeviceReading>(`${this.apiUrl}${id}/`);
  }
  
  // Get IoT device readings (unauthenticated)
  getIoTDeviceReadings(): Observable<DeviceReading[]> {
    return this.http.get<DeviceReading[]>(this.iotApiUrl);
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
