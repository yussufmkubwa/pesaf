import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceReadingService, DeviceReading } from '../device-reading.service';
import { IrrigationEventService, IrrigationEvent } from '../irrigation-event.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  allDeviceReadings: DeviceReading[] = [];
  allIrrigationEvents: IrrigationEvent[] = [];

  constructor(
    private deviceReadingService: DeviceReadingService,
    private irrigationEventService: IrrigationEventService
  ) { }

  ngOnInit(): void {
    this.loadAllDeviceReadings();
    this.loadAllIrrigationEvents();
  }

  loadAllDeviceReadings(): void {
    this.deviceReadingService.getDeviceReadings().subscribe({
      next: (data) => {
        this.allDeviceReadings = data;
        console.log('All device readings for reports:', this.allDeviceReadings);
      },
      error: (error) => {
        console.error('Error loading all device readings for reports:', error);
      }
    });
  }

  loadAllIrrigationEvents(): void {
    this.irrigationEventService.getIrrigationEvents().subscribe({
      next: (data) => {
        this.allIrrigationEvents = data;
        console.log('All irrigation events for reports:', this.allIrrigationEvents);
      },
      error: (error) => {
        console.error('Error loading all irrigation events for reports:', error);
      }
    });
  }
}
