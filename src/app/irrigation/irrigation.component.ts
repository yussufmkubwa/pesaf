import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrrigationEventService, IrrigationEvent } from '../irrigation-event.service';

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './irrigation.component.html',
  styleUrl: './irrigation.component.css'
})
export class IrrigationComponent implements OnInit {
  irrigationEvents: IrrigationEvent[] = [];

  constructor(private irrigationEventService: IrrigationEventService) { }

  ngOnInit(): void {
    this.loadIrrigationEvents();
  }

  loadIrrigationEvents(): void {
    this.irrigationEventService.getIrrigationEvents().subscribe({
      next: (data) => {
        this.irrigationEvents = data;
        console.log('Irrigation events loaded:', this.irrigationEvents);
      },
      error: (error) => {
        console.error('Error loading irrigation events:', error);
      }
    });
  }

  // Example of creating an irrigation event
  createIrrigationEvent(durationMinutes: number, waterConsumedLiters: number, notes?: string): void {
    const newEvent: IrrigationEvent = { duration_minutes: durationMinutes, water_consumed_liters: waterConsumedLiters, notes };
    this.irrigationEventService.createIrrigationEvent(newEvent).subscribe({
      next: (data) => {
        console.log('Irrigation event created:', data);
        this.loadIrrigationEvents(); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating irrigation event:', error);
      }
    });
  }

  // Example of deleting an irrigation event
  deleteIrrigationEvent(id: number): void {
    this.irrigationEventService.deleteIrrigationEvent(id).subscribe({
      next: () => {
        console.log('Irrigation event deleted:', id);
        this.loadIrrigationEvents(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting irrigation event:', error);
      }
    });
  }
}
