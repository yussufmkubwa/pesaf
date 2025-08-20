import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { BlynkService } from '../blynk.service';

interface SensorData {
  temperature: number;
  soilMoisture: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Sensor data
  temperature: string = '--';
  soilMoisture: string = '--';
  
  // Pump control
  pumpRunning: boolean = false;
  processingSequence: boolean = false;
  
  // Auto mode settings
  autoModeEnabled: boolean = true;
  tempThreshold: number = 37;
  
  // System status
  statusText: string = 'System Ready';
  isError: boolean = false;
  lastUpdate: string = 'Never';
  
  // User role
  isAdmin: boolean = false;
  isFarmer: boolean = false;
  
  // Subscriptions
  private dataSubscription?: Subscription;
  private lastClickTime: number = 0;
  private readonly DEBOUNCE_DELAY = 1000;
  private readonly UPDATE_INTERVAL = 5000;
  
  constructor(
    private blynkService: BlynkService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check user role
    this.isAdmin = this.authService.isAdmin();
    this.isFarmer = this.authService.isFarmer();
    
    // Initialize system
    this.initializeSystem();
  }
  
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  async initializeSystem(): Promise<void> {
    this.setStatus('🚀 Initializing Smart Farming System...');
    
    try {
      await this.fetchSensorData();
      this.setStatus('✅ System initialized successfully!');
      
      // Start regular updates
      this.dataSubscription = interval(this.UPDATE_INTERVAL).subscribe(async () => {
        await this.fetchSensorData();
      });
      
    } catch (error) {
      this.setStatus('❌ Failed to initialize system', true);
      console.error('System initialization error:', error);
    }
  }

  async fetchSensorData(): Promise<SensorData> {
    try {
      this.setStatus('Updating sensor data...');
      
      // Use direct API calls like the original JavaScript
      const sensorData = await this.blynkService.fetchSensorDataDirect();
      const tempValue = sensorData.temperature;
      const soilValue = sensorData.soilMoisture;

      // Update UI
      this.temperature = tempValue.toString();
      this.soilMoisture = soilValue.toString();
      this.updateLastUpdateTime();

      // Check for auto pump activation (farmer only)
      if (this.isFarmer && this.autoModeEnabled && tempValue >= this.tempThreshold && 
          !this.pumpRunning && !this.processingSequence) {
        this.setStatus(`🌡️ Temperature ${tempValue}°C reached threshold! Auto-starting pump...`);
        await this.autoStartPump();
      } else {
        this.setStatus('Sensor data updated successfully');
      }

      return { temperature: tempValue, soilMoisture: soilValue };

    } catch (error) {
      console.error('Error fetching sensor data:', error);
      this.setStatus('❌ Error fetching sensor data', true);
      throw error;
    }
  }

  async togglePump(): Promise<void> {
    const currentTime = Date.now();

    // Debounce protection
    if (currentTime - this.lastClickTime < this.DEBOUNCE_DELAY) {
      this.setStatus('⏳ Please wait before clicking again...');
      return;
    }
    this.lastClickTime = currentTime;

    // Prevent multiple operations
    if (this.processingSequence) {
      this.setStatus('⏳ Processing previous command...');
      return;
    }

    this.processingSequence = true;

    try {
      if (!this.pumpRunning) {
        await this.startPumpSequence();
      } else {
        await this.stopPumpSequence();
      }
    } catch (error) {
      console.error('Pump control error:', error);
      this.setStatus('❌ Error controlling pump', true);
    } finally {
      this.processingSequence = false;
    }
  }

  private async startPumpSequence(): Promise<void> {
    this.setStatus('🔄 Starting pump: OFF → ON → OFF');
    
    try {
      // Step 1: Ensure OFF state
      await this.blynkService.sendPumpCommand(0);
      await this.delay(500);

      // Step 2: Turn ON
      await this.blynkService.sendPumpCommand(1);
      await this.delay(500);

      // Step 3: Turn OFF (pump should now be running)
      await this.blynkService.sendPumpCommand(0);
      
      this.pumpRunning = true;
      this.setStatus('✅ Pump started successfully!');

    } catch (error) {
      this.setStatus('❌ Failed to start pump', true);
      throw error;
    }
  }

  private async stopPumpSequence(): Promise<void> {
    this.setStatus('🔄 Stopping pump: OFF → ON');
    
    try {
      // Step 1: Ensure OFF state
      await this.blynkService.sendPumpCommand(0);
      await this.delay(500);

      // Step 2: Turn ON (this stops the pump)
      await this.blynkService.sendPumpCommand(1);
      
      this.pumpRunning = false;
      this.setStatus('🛑 Pump stopped successfully!');

    } catch (error) {
      this.setStatus('❌ Failed to stop pump', true);
      throw error;
    }
  }

  private async autoStartPump(): Promise<void> {
    if (this.processingSequence) return;

    this.processingSequence = true;

    try {
      await this.startPumpSequence();
      this.setStatus('🤖 Auto pump activated - Temperature control active');
    } catch (error) {
      console.error('Auto pump start error:', error);
      this.setStatus('❌ Error with automatic pump start', true);
    } finally {
      this.processingSequence = false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private setStatus(message: string, isError: boolean = false): void {
    this.statusText = message;
    this.isError = isError;
    
    // Auto-clear status after 5 seconds (like the original JavaScript)
    setTimeout(() => {
      if (this.statusText === message) {
        this.statusText = 'System Ready';
        this.isError = false;
      }
    }, 5000);
  }

  private updateLastUpdateTime(): void {
    const now = new Date();
    this.lastUpdate = now.toLocaleTimeString();
  }

  // Getters for template
  get pumpButtonText(): string {
    if (this.processingSequence) {
      return '⏳ Processing...';
    }
    return this.pumpRunning ? '💧 Pump ON' : '💧 Pump OFF';
  }

  get pumpButtonClass(): string {
    if (this.processingSequence) {
      return 'pump-button pump-processing';
    }
    return this.pumpRunning ? 'pump-button pump-on' : 'pump-button pump-off';
  }

  get canControlPump(): boolean {
    return this.isFarmer || this.isAdmin;
  }

  get showAutoMode(): boolean {
    return this.isFarmer;
  }

  get dashboardTitle(): string {
    if (this.isAdmin) {
      return '👑 Admin Dashboard - Smart Farming';
    }
    return '🌱 Smart Farming Dashboard';
  }

  // Additional methods for enhanced functionality
  async checkPumpState(): Promise<void> {
    try {
      const pumpState = await this.blynkService.getPumpStateDirect();
      this.pumpRunning = pumpState === 1;
    } catch (error) {
      console.error('Error checking pump state:', error);
    }
  }

  updatePumpButton(): void {
    // This method helps with UI updates
    // The actual update is handled by Angular's change detection
    console.log(`Pump button state: ${this.pumpRunning ? 'ON' : 'OFF'}, Processing: ${this.processingSequence}`);
  }
}
