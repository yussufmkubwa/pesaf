import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BlynkService } from '../blynk.service';
import { PumpScenarioService, PumpState } from '../pump-scenario.service';

interface MonitoringData {
  temperature: number;
  soilMoisture: number;
  lastUpdated: Date;
}

interface LogEntry {
  timestamp: Date;
  action: string;
  status: string;
}

@Component({
  selector: 'app-pump-monitoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pump-monitoring.component.html',
  styleUrl: './pump-monitoring.component.css'
})
export class PumpMonitoringComponent implements OnInit, OnDestroy {
  // Data properties
  monitoringData: MonitoringData = {
    temperature: 0,
    soilMoisture: 0,
    lastUpdated: new Date()
  };
  
  pumpState: PumpState | null = null;
  
  // Activity log
  activityLog: LogEntry[] = [];
  
  // Polling interval in milliseconds
  private readonly POLL_INTERVAL = 10000;
  
  // Subscriptions to be cleaned up
  private dataSubscription: Subscription | null = null;
  private pumpSubscription: Subscription | null = null;
  
  constructor(
    private blynkService: BlynkService,
    private pumpScenarioService: PumpScenarioService
  ) {}
  
  ngOnInit(): void {
    // Start polling for temperature and soil moisture data
    this.dataSubscription = interval(this.POLL_INTERVAL)
      .pipe(
        switchMap(() => this.blynkService.getDashboardData())
      )
      .subscribe(data => {
        this.monitoringData = {
          temperature: data.temperature,
          soilMoisture: data.soil_moisture,
          lastUpdated: new Date()
        };
      });
      
    // Subscribe to pump state updates
    this.pumpSubscription = this.pumpScenarioService.pumpState$.subscribe(
      state => {
        // If state changed, add to log
        if (!this.pumpState || 
            this.pumpState.isRunning !== state.isRunning || 
            this.pumpState.isProcessing !== state.isProcessing) {
          this.addLogEntry(state);
        }
        this.pumpState = state;
      }
    );
    
    // Initial data fetch
    this.blynkService.getDashboardData().subscribe(
      data => {
        this.monitoringData = {
          temperature: data.temperature,
          soilMoisture: data.soil_moisture,
          lastUpdated: new Date()
        };
      }
    );
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.pumpSubscription) {
      this.pumpSubscription.unsubscribe();
    }
  }
  
  // Add an entry to the activity log
  private addLogEntry(state: PumpState): void {
    let action = 'Status update';
    
    if (state.isProcessing) {
      action = state.isRunning ? 'Stopping pump' : 'Starting pump';
    } else if (this.pumpState && this.pumpState.isRunning !== state.isRunning) {
      action = state.isRunning ? 'Pump started' : 'Pump stopped';
    }
    
    this.activityLog.unshift({
      timestamp: new Date(),
      action,
      status: state.status
    });
    
    // Keep log to reasonable size
    if (this.activityLog.length > 20) {
      this.activityLog.pop();
    }
  }
  
  // Toggle the pump
  togglePump(): void {
    if (this.pumpState && !this.pumpState.isProcessing) {
      this.pumpScenarioService.togglePump().subscribe();
    }
  }
  
  // Check if conditions might suggest irrigation is needed
  get irrigationRecommended(): boolean {
    return this.monitoringData.soilMoisture < 30;
  }
}
