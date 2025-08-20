import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { BlynkService } from '../blynk.service';
import { User, UserService } from '../user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  userForm: FormGroup;
  
  // Status properties for user management feedback
  statusText: string = 'Admin Panel Ready';
  isError: boolean = false;

  // Smart farming dashboard properties
  temperature: string = '--';
  soilMoisture: string = '--';
  pumpRunning: boolean = false;
  processingSequence: boolean = false;
  autoModeEnabled: boolean = true;
  tempThreshold: number = 37;
  lastUpdate: string = 'Never';

  // Subscriptions
  private dataSubscription?: Subscription;
  private lastClickTime: number = 0;
  private readonly DEBOUNCE_DELAY = 1000;
  private readonly UPDATE_INTERVAL = 5000;

  constructor(
    private userService: UserService,
    private blynkService: BlynkService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      role: ['farmer', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.initializeSmartFarming();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // User Management Methods
  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset({ role: 'farmer' });
          this.setStatus('✅ User created successfully!');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.setStatus('❌ Failed to create user', true);
        }
      });
    }
  }

  editUser(user: User): void {
    // Implementation for editing user
    console.log('Edit user:', user);
    this.setStatus(`📝 Editing user: ${user.username}`);
  }

  deleteUser(userId: number | undefined): void {
    if (!userId) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.setStatus('🗑️ User deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.setStatus('❌ Failed to delete user', true);
        }
      });
    }
  }

  trackByUserId(index: number, user: User): number {
    return user.id || index;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  canDeleteAdmin(user: User): boolean {
    return user.role !== 'admin' || this.getAdminCount() > 1;
  }

  // Smart Farming Methods
  async initializeSmartFarming(): Promise<void> {
    this.setStatus('🚀 Initializing Admin Smart Farming Dashboard...');
    
    try {
      await this.fetchSensorData();
      this.setStatus('✅ Admin farming dashboard initialized successfully!');
      
      // Start regular updates
      this.dataSubscription = interval(this.UPDATE_INTERVAL).subscribe(async () => {
        await this.fetchSensorData();
      });
      
    } catch (error) {
      this.setStatus('❌ Failed to initialize farming dashboard', true);
      console.error('Admin farming dashboard initialization error:', error);
    }
  }

  async fetchSensorData(): Promise<void> {
    try {
      // Use direct API calls like the original JavaScript
      const sensorData = await this.blynkService.fetchSensorDataDirect();
      const tempValue = sensorData.temperature;
      const soilValue = sensorData.soilMoisture;

      // Update UI
      this.temperature = tempValue.toString();
      this.soilMoisture = soilValue.toString();
      this.updateLastUpdateTime();

      // Check pump status using direct API
      const pumpState = await this.blynkService.getPumpStateDirect();
      this.pumpRunning = pumpState === 1;

      // Auto mode check: If temperature ≥ 37°C, automatically start pump with OFF → ON → OFF sequence
      if (this.autoModeEnabled && tempValue >= this.tempThreshold && 
          !this.pumpRunning && !this.processingSequence) {
        this.setStatus(`🌡️ Admin Auto Mode: Temperature ${tempValue}°C ≥ ${this.tempThreshold}°C! Auto-starting pump...`);
        await this.autoStartPump();
      } else if (!this.processingSequence) {
        this.setStatus('Admin farming data updated');
      }

    } catch (error) {
      console.error('Error fetching sensor data:', error);
      this.setStatus('❌ Error fetching sensor data', true);
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
      console.error('Admin pump control error:', error);
      this.setStatus('❌ Error controlling pump', true);
    } finally {
      this.processingSequence = false;
    }
  }

  private async autoStartPump(): Promise<void> {
    if (this.processingSequence) return;

    this.processingSequence = true;

    try {
      // Execute the same OFF → ON → OFF sequence automatically
      await this.startPumpSequence();
      this.setStatus('🤖 Admin Auto pump activated - Temperature control active');
    } catch (error) {
      console.error('Admin auto pump start error:', error);
      this.setStatus('❌ Error with automatic pump start', true);
    } finally {
      this.processingSequence = false;
    }
  }

  private async startPumpSequence(): Promise<void> {
    this.setStatus('🔄 Admin starting pump: OFF → ON → OFF');
    
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
      this.setStatus('✅ Admin: Pump started successfully!');

    } catch (error) {
      this.setStatus('❌ Admin: Failed to start pump', true);
      throw error;
    }
  }

  private async stopPumpSequence(): Promise<void> {
    this.setStatus('🔄 Admin stopping pump: OFF → ON');
    
    try {
      // Step 1: Ensure OFF state
      await this.blynkService.sendPumpCommand(0);
      await this.delay(500);

      // Step 2: Turn ON (this stops the pump)
      await this.blynkService.sendPumpCommand(1);
      
      this.pumpRunning = false;
      this.setStatus('🛑 Admin: Pump stopped successfully!');

    } catch (error) {
      this.setStatus('❌ Admin: Failed to stop pump', true);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  private setStatus(message: string, isError: boolean = false): void {
    this.statusText = message;
    this.isError = isError;
    
    // Auto-clear status after 5 seconds
    setTimeout(() => {
      if (this.statusText === message) {
        this.statusText = 'Admin Panel Ready';
        this.isError = false;
      }
    }, 5000);
  }
}
