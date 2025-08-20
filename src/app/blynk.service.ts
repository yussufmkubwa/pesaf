import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface BlynkDashboardData {
  temperature: number;
  soil_moisture: number;
  pump_status: number;
  is_pump_on: boolean;
  timestamp: string;
}

export interface BlynkPumpStatus {
  pump_status: number;
  timestamp: string;
}

export interface BlynkSetPumpRequest {
  status: boolean;
}

export interface BlynkSetPumpResponse {
  success: boolean;
  pump_status: number;
  timestamp: string;
}

export interface BlynkSoilMoistureData {
  soil_moisture: number;
  timestamp: string;
}

export interface BlynkTemperatureData {
  temperature: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlynkService {
  // Direct Blynk Cloud API via proxy
  private BLYNK_TOKEN = "oM1I_kX96wCPnfZe5vM8xTmzy84hW65p";
  private BLYNK_BASE = "/blynk"; // Proxy route defined in proxy.conf.json
  
  // Virtual Pin Mapping
  private readonly V_TEMPERATURE = "V0";
  private readonly V_SOIL_MOISTURE = "V1";
  private readonly V_PUMP_STATUS = "V2";

  constructor(private http: HttpClient) { }
  
  // Get value from Blynk virtual pin
  private getBlynkPinValue(vpin: string): Observable<any> {
    const url = `${this.BLYNK_BASE}/get?token=${this.BLYNK_TOKEN}&pin=${vpin}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0]; // Blynk returns list of values
        }
        return null;
      })
    );
  }
  
  // Set value to Blynk virtual pin
  private setBlynkPinValue(vpin: string, value: any): Observable<boolean> {
    // Using direct URL format for Blynk API
    const url = `https://blynk.cloud/external/api/update?token=${this.BLYNK_TOKEN}&pin=${vpin}&value=${value}`;
    return this.http.get(url).pipe(
      map(() => true),
      catchError((err: any) => {
        console.error('Error setting Blynk pin value:', err);
        return of(false);
      })
    );
  }

  // Get all dashboard data at once
  getDashboardData(): Observable<BlynkDashboardData> {
    // Get all values in parallel using direct URL methods
    return forkJoin({
      temperature: this.getTemperatureValue(),
      soil_moisture: this.getSoilMoistureValue(),
      pump: this.getBlynkPinValue(this.V_PUMP_STATUS)
    }).pipe(
      map((result: {temperature: number, soil_moisture: number, pump: any}) => {
        const pumpStatus = Number(result.pump) || 0;
        return {
          temperature: result.temperature || 25,
          soil_moisture: result.soil_moisture || 60,
          pump_status: pumpStatus,
          is_pump_on: pumpStatus === 1,
          timestamp: new Date().toISOString()
        };
      }),
      catchError((err: any) => {
        console.error('Error getting Blynk dashboard data:', err);
        // Return simulated data on error
        return of({
          temperature: 25,
          soil_moisture: 60,
          pump_status: 0,
          is_pump_on: false,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getPumpStatus(): Observable<BlynkPumpStatus> {
    return this.getBlynkPinValue(this.V_PUMP_STATUS).pipe(
      map(value => {
        const pumpStatus = Number(value) || 0;
        return {
          pump_status: pumpStatus,
          timestamp: new Date().toISOString()
        };
      }),
      catchError((err: any) => {
        console.error('Error getting Blynk pump status:', err);
        return of({
          pump_status: 0,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  setPumpStatus(status: boolean): Observable<BlynkSetPumpResponse> {
    const pumpValue = status ? 1 : 0;
    
    // Using proxy URL format for specific pump control
    const url = `${this.BLYNK_BASE}/update?token=${this.BLYNK_TOKEN}&pin=${this.V_PUMP_STATUS}&value=${pumpValue}`;
    
    return this.http.get(url).pipe(
      map(() => ({
        success: true,
        pump_status: pumpValue,
        timestamp: new Date().toISOString()
      })),
      catchError((err: any) => {
        console.error('Error setting pump status:', err);
        return of({
          success: false,
          pump_status: status ? 0 : 1, // Return the opposite of what was requested to indicate failure
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getSoilMoisture(): Observable<BlynkSoilMoistureData> {
    // Use the direct URL method instead of generic method
    return this.getSoilMoistureValue().pipe(
      map(value => ({
        soil_moisture: value || 60,
        timestamp: new Date().toISOString()
      })),
      catchError((err: any) => {
        console.error('Error getting soil moisture:', err);
        return of({
          soil_moisture: 60,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  // Get only raw temperature value via proxy
  getTemperatureValue(): Observable<number> {
    const url = `${this.BLYNK_BASE}/get?token=${this.BLYNK_TOKEN}&pin=${this.V_TEMPERATURE}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const value = Array.isArray(response) && response.length > 0 ? response[0] : response;
        return Number(value) || 0;
      }),
      catchError((err: any) => {
        console.error('Error getting temperature value:', err);
        return of(0);
      })
    );
  }
  
  // Get only raw soil moisture value via proxy
  getSoilMoistureValue(): Observable<number> {
    const url = `${this.BLYNK_BASE}/get?token=${this.BLYNK_TOKEN}&pin=${this.V_SOIL_MOISTURE}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const value = Array.isArray(response) && response.length > 0 ? response[0] : response;
        return Number(value) || 0;
      }),
      catchError((err: any) => {
        console.error('Error getting soil moisture value:', err);
        return of(0);
      })
    );
  }
  
  // This method is kept for backward compatibility
  getTemperature(): Observable<BlynkTemperatureData> {
    // Use the direct URL method instead of generic method
    return this.getTemperatureValue().pipe(
      map(value => ({
        temperature: value || 25,
        timestamp: new Date().toISOString()
      }))
    );
  }
}