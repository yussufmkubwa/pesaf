import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, map, switchMap, tap } from 'rxjs/operators';

export interface PumpState {
  isRunning: boolean;
  isProcessing: boolean;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PumpScenarioService {
  // Blynk API endpoints via proxy
  private readonly BLYNK_TOKEN = "oM1I_kX96wCPnfZe5vM8xTmzy84hW65p";
  private readonly BLYNK_BASE = "/blynk";
  private readonly pumpUrl = `${this.BLYNK_BASE}/update?token=${this.BLYNK_TOKEN}&pin=V2&value=`;
  private readonly pumpStateUrl = `${this.BLYNK_BASE}/get?token=${this.BLYNK_TOKEN}&pin=V2`;
  
  // BehaviorSubject to track and expose pump state
  private pumpStateSubject = new BehaviorSubject<PumpState>({
    isRunning: false,
    isProcessing: false,
    status: 'Pump is OFF'
  });
  
  // Observable that components can subscribe to
  public pumpState$ = this.pumpStateSubject.asObservable();

  constructor(private http: HttpClient) { 
    // Initialize pump state from Blynk on service start
    this.syncPumpState();
  }
  
  // Get the current state of the pump
  syncPumpState() {
    // Don't update if we're in the middle of a sequence
    if (this.pumpStateSubject.value.isProcessing) {
      return;
    }
    
    this.http.get<any>(this.pumpStateUrl).pipe(
      catchError(() => of(0))
    ).subscribe(value => {
      const currentState = this.pumpStateSubject.value;
      // Only update if not processing
      if (!currentState.isProcessing) {
        this.pumpStateSubject.next({
          isRunning: currentState.isRunning, // Keep the app's concept of running state
          isProcessing: false,
          status: currentState.isRunning ? 'Pump is ON' : 'Pump is OFF'
        });
      }
    });
  }
  
  // Toggle the pump using the special sequence
  togglePump(): Observable<boolean> {
    const currentState = this.pumpStateSubject.value;
    
    // Prevent multiple calls during processing
    if (currentState.isProcessing) {
      return of(false);
    }
    
    // Update state to processing
    this.pumpStateSubject.next({
      ...currentState,
      isProcessing: true,
      status: currentState.isRunning ? 'Stopping pump...' : 'Starting pump...'
    });
    
    // Run appropriate sequence based on current state
    return (currentState.isRunning ? this.stopPumpSequence() : this.startPumpSequence()).pipe(
      finalize(() => {
        const newRunningState = !currentState.isRunning;
        this.pumpStateSubject.next({
          isRunning: newRunningState,
          isProcessing: false,
          status: newRunningState ? 'Pump is ON' : 'Pump is OFF'
        });
      })
    );
  }
  
  // START PUMP SEQUENCE: OFF → ON → OFF
  private startPumpSequence(): Observable<boolean> {
    this.updateStatus('Starting pump: OFF → ON → OFF');
    
    // Step 1: Ensure OFF state
    return this.sendPumpCommand(0).pipe(
      // Step 2: Turn ON after a delay
      delay(500),
      switchMap(() => this.sendPumpCommand(1)),
      // Step 3: Turn OFF after a delay (pump should now be running)
      delay(500),
      switchMap(() => this.sendPumpCommand(0)),
      tap(() => this.updateStatus('Pump started successfully'))
    );
  }
  
  // STOP PUMP SEQUENCE: OFF → ON
  private stopPumpSequence(): Observable<boolean> {
    this.updateStatus('Stopping pump: OFF → ON');
    
    // Step 1: Ensure OFF state
    return this.sendPumpCommand(0).pipe(
      // Step 2: Turn ON (this stops the pump)
      delay(500),
      switchMap(() => this.sendPumpCommand(1)),
      tap(() => this.updateStatus('Pump stopped successfully'))
    );
  }
  
  // Send a single command to the Blynk API
  private sendPumpCommand(value: number): Observable<boolean> {
    return this.http.get(this.pumpUrl + value).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Failed to send pump command ${value}:`, error);
        this.updateStatus('Error controlling pump');
        return of(false);
      })
    );
  }
  
  // Helper to update status in the BehaviorSubject
  private updateStatus(status: string) {
    const currentState = this.pumpStateSubject.value;
    this.pumpStateSubject.next({
      ...currentState,
      status
    });
  }
}
