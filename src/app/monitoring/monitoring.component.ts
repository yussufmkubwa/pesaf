import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DeviceReading, DeviceReadingService } from '../device-reading.service';
import { PumpControlService } from '../pump-control.service';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit, OnDestroy {
  pumpStatus: string = 'OFF';
  deviceReadings: DeviceReading[] = [];
  latestReading: DeviceReading | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  private readingsSubscription?: Subscription;
  private pumpSubscription?: Subscription;

  constructor(
    private pumpControlService: PumpControlService,
    private deviceReadingService: DeviceReadingService
  ) { }

  ngOnInit(): void {
    // Initial data load
    this.loadPumpStatus();
    this.loadDeviceReadings();
    
    // Set up polling for real-time updates (every 30 seconds)
    this.readingsSubscription = interval(30000).pipe(
      switchMap(() => this.deviceReadingService.getDeviceReadings())
    ).subscribe({
      next: (readings) => {
        this.deviceReadings = readings;
        this.latestReading = readings.length > 0 ? readings[0] : null;
      },
      error: (err) => {
        console.error('Error fetching device readings:', err);
        this.error = 'Failed to update sensor readings. Please refresh the page.';
      }
    });
    
    this.pumpSubscription = interval(15000).pipe(
      switchMap(() => this.pumpControlService.getLatestPumpStatus())
    ).subscribe({
      next: (status) => {
        this.pumpStatus = status.status;
      },
      error: (err) => {
        console.error('Error fetching pump status:', err);
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    if (this.readingsSubscription) {
      this.readingsSubscription.unsubscribe();
    }
    if (this.pumpSubscription) {
      this.pumpSubscription.unsubscribe();
    }
  }

  loadPumpStatus(): void {
    this.pumpControlService.getLatestPumpStatus().subscribe({
      next: (status) => {
        this.pumpStatus = status.status;
      },
      error: (err) => {
        console.error('Error fetching pump status:', err);
        this.error = 'Failed to load pump status';
      }
    });
  }

  loadDeviceReadings(): void {
    this.loading = true;
    this.deviceReadingService.getDeviceReadings().subscribe({
      next: (readings) => {
        this.deviceReadings = readings;
        this.latestReading = readings.length > 0 ? readings[0] : null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching device readings:', err);
        this.error = 'Failed to load sensor readings';
        this.loading = false;
      }
    });
  }

  togglePump(): void {
    const newStatus = this.pumpStatus === 'ON' ? 'OFF' : 'ON';
    this.pumpControlService.setPumpStatus(newStatus).subscribe({
      next: (status) => {
        this.pumpStatus = status.status;
      },
      error: (err) => {
        console.error('Error toggling pump status:', err);
        this.error = 'Failed to update pump status';
      }
    });
  }
  
  getTemperatureClass(temp: number): string {
    if (temp > 30) return 'text-danger';
    if (temp > 25) return 'text-warning';
    return 'text-success';
  }
  
  getMoistureClass(moisture: number): string {
    if (moisture < 30) return 'text-danger';
    if (moisture < 60) return 'text-warning';
    return 'text-success';
  }
  
  // Refresh data manually
  refreshData(): void {
    this.loadPumpStatus();
    this.loadDeviceReadings();
  }
}
