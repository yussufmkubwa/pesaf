import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BlynkDashboardData, BlynkService } from '../blynk.service';
import { PumpScenarioService, PumpState } from '../pump-scenario.service';

@Component({
  selector: 'app-smart-irrigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smart-irrigation.component.html',
  styleUrl: './smart-irrigation.component.css'
})
export class SmartIrrigationComponent implements OnInit, OnDestroy {
  // Data properties
  dashboardData: BlynkDashboardData | null = null;
  pumpState: PumpState | null = null;

  // Polling interval in milliseconds
  private readonly POLL_INTERVAL = 5000;
  
  // Subscriptions to be cleaned up
  private dataSubscription: Subscription | null = null;
  private pumpSubscription: Subscription | null = null;
  
  constructor(
    private blynkService: BlynkService,
    private pumpScenarioService: PumpScenarioService
  ) {}
  
  ngOnInit(): void {
    // Start polling for data
    this.dataSubscription = interval(this.POLL_INTERVAL)
      .pipe(
        switchMap(() => this.blynkService.getDashboardData())
      )
      .subscribe(data => {
        this.dashboardData = data;
      });
    
    // Subscribe to pump state updates
    this.pumpSubscription = this.pumpScenarioService.pumpState$.subscribe(
      state => this.pumpState = state
    );
    
    // Initial data fetch
    this.blynkService.getDashboardData().subscribe(
      data => this.dashboardData = data
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
  
  // Toggle pump with the special sequence
  togglePump(): void {
    // Only allow toggle if not already processing
    if (this.pumpState && !this.pumpState.isProcessing) {
      this.pumpScenarioService.togglePump().subscribe();
    }
  }
}
