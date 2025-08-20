import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BlynkService } from '../blynk.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  temperature: string = '--';
  soilMoisture: string = '--';
  isPumpOn: boolean = false;
  
  private dataSubscription?: Subscription;
  
  constructor(private blynkService: BlynkService) { }

  ngOnInit(): void {
    // Load data initially
    this.fetchData();
    
    // Set up polling every 5 seconds
    this.dataSubscription = interval(5000).subscribe(() => {
      this.fetchData();
    });
  }
  
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchData(): void {
    // Get temperature
    this.blynkService.getTemperatureValue().subscribe({
      next: (temp) => {
        this.temperature = temp.toString();
      },
      error: (err) => {
        console.error('Error getting temperature:', err);
        this.temperature = '--';
      }
    });

    // Get soil moisture
    this.blynkService.getSoilMoistureValue().subscribe({
      next: (moisture) => {
        this.soilMoisture = moisture.toString();
      },
      error: (err) => {
        console.error('Error getting soil moisture:', err);
        this.soilMoisture = '--';
      }
    });

    // Get pump status
    this.blynkService.getPumpStatus().subscribe({
      next: (status) => {
        this.isPumpOn = status.pump_status === 1;
      },
      error: (err) => {
        console.error('Error getting pump status:', err);
      }
    });
  }

  pumpControl(state: number): void {
    const status = state === 1;
    this.blynkService.setPumpStatus(status).subscribe({
      next: (response) => {
        if (response.success) {
          this.isPumpOn = response.pump_status === 1;
          alert(`Pump turned ${this.isPumpOn ? 'ON' : 'OFF'}`);
        } else {
          alert('Failed to update pump status');
        }
      },
      error: (err) => {
        console.error('Pump control error:', err);
        alert('Error controlling pump');
      }
    });
  }
}
